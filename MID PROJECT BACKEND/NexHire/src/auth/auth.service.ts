import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThan, Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Job } from '../jobs/entities/job.entity';
import { Application } from '../applications/entities/application.entity';
import { Message } from '../recruiter/entities/message.entity';
import { CandidateProfile } from '../candidate/entities/candidate-profile.entity';
import { RecruiterProfile } from '../recruiter/entities/recruiter-profile.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  private readonly blockedEmailDomains = [
    'example.com',
    'mailinator.com',
    'tempmail.com',
    'guerrillamail.com',
    '10minutemail.com',
  ];

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(CandidateProfile)
    private profileRepository: Repository<CandidateProfile>,
    @InjectRepository(RecruiterProfile)
    private recruiterProfileRepository: Repository<RecruiterProfile>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const { email, password, firstName, lastName, companyName } = registerDto;

    // Validate email domain
    const emailDomain = email.split('@')[1].toLowerCase();
    if (this.blockedEmailDomains.includes(emailDomain)) {
      throw new BadRequestException('Email domain is not allowed');
    }

    // Check for existing user (case-insensitive)
    const existingUser = await this.userRepository
      .createQueryBuilder('user')
      .where('LOWER(user.email) = LOWER(:email)', { email })
      .getOne();
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // Validate and hash password
    if (!password || password.trim().length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }
    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const role = companyName ? UserRole.RECRUITER : UserRole.CANDIDATE;

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      companyName,
      role,
    });

    const savedUser = await this.userRepository.save(user);

    // Auto-create profile based on role
    if (role === UserRole.CANDIDATE) {
      const candidateProfile = this.profileRepository.create({
        user: savedUser,
        isVisible: true,
      });
      await this.profileRepository.save(candidateProfile);
    } else if (role === UserRole.RECRUITER) {
      const recruiterProfile = this.recruiterProfileRepository.create({
        user: savedUser,
        companyName: savedUser.companyName,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
      });
      await this.recruiterProfileRepository.save(recruiterProfile);
    }

    return savedUser;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('LOWER(user.email) = LOWER(:email)', { email })
      .getOne();
    if (!user) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }
    return user;
  }

  async login(user: User): Promise<{ access_token: string }> {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;

    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('LOWER(user.email) = LOWER(:email)', { email })
      .getOne();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await this.userRepository.save(user);

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    try {
      await transporter.sendMail({
        to: email,
        subject: 'NexHire Password Reset OTP',
        text: `Your OTP for password reset is: ${token}. It expires in 5 minutes.`,
      });
    } catch (error) {
      throw new BadRequestException('Failed to send OTP. Please try again.');
    }

    return { message: 'OTP sent to your email' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { token, password } = resetPasswordDto;
    const user = await this.userRepository.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: MoreThan(new Date()),
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired token');
    }

    user.password = await bcrypt.hash(password.trim(), 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await this.userRepository.save(user);

    return { message: 'Password reset successfully' };
  }

  async logout(token: string): Promise<void> {
    return;
  }

  async deleteAccount(userId: number): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['candidateProfile', 'recruiterProfile', 'jobs', 'applications', 'sentMessages', 'receivedMessages'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Delete applications first (to avoid job foreign key issues)
    if (user.applications && user.applications.length > 0) {
      await this.applicationRepository.delete({ candidate: { id: userId } });
    }
    // Delete applications for jobs posted by this recruiter
    if (user.jobs && user.jobs.length > 0) {
      const jobIds = user.jobs.map(job => job.id);
      await this.applicationRepository.delete({ job: { id: In(jobIds) } });
    }
    // Delete jobs
    if (user.jobs && user.jobs.length > 0) {
      await this.jobRepository.delete({ recruiter: { id: userId } });
    }
    // Delete messages
    if (user.sentMessages && user.sentMessages.length > 0) {
      await this.messageRepository.delete({ sender: { id: userId } });
    }
    if (user.receivedMessages && user.receivedMessages.length > 0) {
      await this.messageRepository.delete({ receiver: { id: userId } });
    }
    // Delete candidate profile
    if (user.candidateProfile) {
      await this.profileRepository.delete({ user: { id: userId } });
    }
    // Delete recruiter profile
    if (user.recruiterProfile) {
      await this.recruiterProfileRepository.delete({ user: { id: userId } });
    }

    // Delete user
    await this.userRepository.delete(userId);

    return { message: 'Account deleted successfully' };
  }
}