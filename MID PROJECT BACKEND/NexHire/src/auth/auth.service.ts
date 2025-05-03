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
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';


@Injectable()
export class AuthService {
  blacklistedTokenRepository: any;
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
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const { email, password, firstName, lastName, companyName } = registerDto;

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = companyName ? UserRole.RECRUITER : UserRole.CANDIDATE;

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      companyName,
      role,
    });

    return this.userRepository.save(user);
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const { email } = forgotPasswordDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes later

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

    await transporter.sendMail({
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${token}. It expires in 5 minutes.`,
    });
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { token, password } = resetPasswordDto;
    const user = await this.userRepository.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: MoreThan(new Date()), // Use TypeORM's MoreThan operator
      },
    });
  
    if (!user) {
      throw new BadRequestException('Invalid or expired token');
    }
  
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await this.userRepository.save(user);
  }

  async logout(token: string): Promise<void> {
    const decoded = this.jwtService.decode(token);
    if (!decoded) {
      throw new BadRequestException('Invalid token');
    }
    const blacklistedToken = this.blacklistedTokenRepository.create({
      token, // Store full token
      expiresAt: new Date(decoded.exp * 1000), // Convert exp to timestamp
    });
    await this.blacklistedTokenRepository.save(blacklistedToken);
  }

  async deleteAccount(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['candidateProfile', 'jobs', 'applications', 'sentMessages', 'receivedMessages'],
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
  
    // Delete user
    await this.userRepository.delete(userId);
  }

}
