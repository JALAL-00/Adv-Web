import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Job } from '../jobs/entities/job.entity';
import { User, UserRole } from '../auth/entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { DeleteJobDto } from './dto/delete-job.dto';
import { SearchCandidateDto } from './dto/search-candidate.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { Message } from './entities/message.entity';
import { EmailService } from '../common/email.service';
import { ApplicationsService } from '../applications/applications.service';
import { ScreeningResult } from '../screening/entities/screening-result.entity';
import { CandidateProfile } from '../candidate/entities/candidate-profile.entity';
import { RecruiterProfile } from './entities/recruiter-profile.entity';

@Injectable()
export class RecruiterService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(CandidateProfile)
    private candidateProfileRepository: Repository<CandidateProfile>,
    @InjectRepository(ScreeningResult)
    private screeningResultRepository: Repository<ScreeningResult>,
    @InjectRepository(RecruiterProfile)
    private recruiterProfileRepository: Repository<RecruiterProfile>,
    private emailService: EmailService,
    private applicationsService: ApplicationsService,
  ) {}

  async getProfile(userId: number): Promise<RecruiterProfile> {
    const profile = await this.recruiterProfileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<RecruiterProfile> {
    let profile = await this.recruiterProfileRepository.findOne({ where: { user: { id: userId } } });
    if (!profile) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      profile = this.recruiterProfileRepository.create({ user, ...updateProfileDto });
    } else {
      Object.assign(profile, updateProfileDto);
    }
    return this.recruiterProfileRepository.save(profile);
  }

  async createJob(userId: number, createJobDto: CreateJobDto): Promise<Job> {
    const recruiter = await this.userRepository.findOne({ where: { id: userId } });
    if (!recruiter) {
      throw new NotFoundException('Recruiter not found');
    }
    const job = this.jobRepository.create({ ...createJobDto, recruiter });
    const savedJob = await this.jobRepository.save(job);
    await this.notifyCandidates(savedJob);
    return savedJob;
  }

  async updateJob(userId: number, jobId: number, updateJobDto: UpdateJobDto): Promise<Job> {
    const job = await this.jobRepository.findOne({ where: { id: jobId, recruiter: { id: userId } } });
    if (!job) {
      throw new NotFoundException('Job not found or not authorized');
    }
    const { jobId: _, ...updateData } = updateJobDto;
    Object.assign(job, updateData);
    return this.jobRepository.save(job);
  }

async deleteJob(userId: number, jobId: number): Promise<{ message: string }> {
  const job = await this.jobRepository.findOne({ where: { id: jobId, recruiter: { id: userId } } });
  if (!job) {
    throw new NotFoundException('Job not found or not authorized');
  }
  await this.screeningResultRepository.delete({ job: { id: jobId } });
  await this.jobRepository.remove(job);
  return { message: 'Job deleted successfully' };
}

  async listJobs(userId: number): Promise<Job[]> {
    return this.jobRepository.find({ where: { recruiter: { id: userId } } });
  }

  async viewApplications(userId: number, jobId: number): Promise<any> {
    const job = await this.jobRepository.findOne({ where: { id: jobId, recruiter: { id: userId } } });
    if (!job) {
      throw new NotFoundException('Job not found or not authorized');
    }
    return this.applicationsService.getAllApplications(userId);
  }

  async searchCandidates(searchCandidateDto: SearchCandidateDto): Promise<CandidateProfile[]> {
    const { title, skills, location } = searchCandidateDto;
    return this.candidateProfileRepository.find({
      where: {
        ...(title && { firstName: Like(`%${title}%`) }),
        ...(skills && { skills: Like(`%${skills}%`) }),
        ...(location && { phone: Like(`%${location}%`) }),
      },
      relations: ['user'],
    });
  }

  async sendMessage(userId: number, sendMessageDto: SendMessageDto): Promise<Message> {
    const { receiverId, content } = sendMessageDto;
    const sender = await this.userRepository.findOne({ where: { id: userId } });
    const receiver = await this.userRepository.findOne({ where: { id: receiverId, role: UserRole.CANDIDATE } });
    if (!sender || !receiver) {
      throw new NotFoundException('Sender or receiver not found');
    }
    const message = this.messageRepository.create({ content, sender, receiver });
    await this.sendEmailNotification(receiver.email, 'New Message', `You received a message: ${content}`);
    return this.messageRepository.save(message);
  }

  private async sendEmailNotification(email: string, subject: string, message: string): Promise<void> {
    console.log(`Sending email notification to: ${email}`);
    await this.emailService.sendMail(email, subject, message);
    console.log(`Email notification sent to ${email}`);
  }

  private async notifyCandidates(job: Job): Promise<void> {
    const candidates = await this.userRepository.find({ where: { role: UserRole.CANDIDATE } });
    for (const candidate of candidates) {
      await this.sendEmailNotification(
        candidate.email,
        `New Job Opportunity: ${job.title}`,
        `A new job "${job.title}" has been posted. Location: ${job.location}, Salary: ${job.salary}.`,
      );
    }
  }
}