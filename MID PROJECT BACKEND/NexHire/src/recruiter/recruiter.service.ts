import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User, UserRole } from '../auth/entities/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { Application } from '../applications/entities/application.entity';
import { Message } from './entities/message.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { SearchCandidateDto } from './dto/search-candidate.dto';
import { SendMessageDto } from './dto/send-message.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class RecruiterService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, updateProfileDto);
    return this.userRepository.save(user);
  }

  async createJob(userId: number, createJobDto: CreateJobDto): Promise<Job> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const job = this.jobRepository.create({ ...createJobDto, recruiter: user });
    const savedJob = await this.jobRepository.save(job);
    await this.notifyCandidates(savedJob);
    return savedJob;
  }

  async updateJob(userId: number, jobId: number, updateJobDto: UpdateJobDto): Promise<Job> {
    const job = await this.jobRepository.findOne({ where: { id: jobId, recruiter: { id: userId } } });
    if (!job) {
      throw new NotFoundException('Job not found or not authorized');
    }
    Object.assign(job, updateJobDto);
    const updatedJob = await this.jobRepository.save(job);
    await this.notifyCandidates(updatedJob);
    return updatedJob;
  }

  async deleteJob(userId: number, jobId: number): Promise<void> {
    const job = await this.jobRepository.findOne({ where: { id: jobId, recruiter: { id: userId } } });
    if (!job) {
      throw new NotFoundException('Job not found or not authorized');
    }
    await this.jobRepository.remove(job);
  }

  async listJobs(userId: number): Promise<Job[]> {
    return this.jobRepository.find({ where: { recruiter: { id: userId } } });
  }

  async viewApplications(userId: number, jobId: number): Promise<Application[]> {
    const job = await this.jobRepository.findOne({ where: { id: jobId, recruiter: { id: userId } } });
    if (!job) {
      throw new NotFoundException('Job not found or not authorized');
    }
    return this.applicationRepository.find({ where: { job: { id: jobId } }, relations: ['candidate'] });
  }

  async searchCandidates(searchCandidateDto: SearchCandidateDto): Promise<User[]> {
    const { title, skills, experience, location } = searchCandidateDto;
    return this.userRepository.find({
      where: {
        role: UserRole.CANDIDATE,
        ...(title && { firstName: Like(`%${title}%`) }),
        ...(location && { phone: Like(`%${location}%`) }),
      },
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

  private async notifyCandidates(job: Job): Promise<void> {
    console.log('Notifying candidates for job:', job.title, 'Skills:', job.skills);
    const candidates = await this.userRepository.find({
      where: { role: UserRole.CANDIDATE },
    });
    console.log('Found candidates:', candidates.length, candidates.map(c => c.email));

    if (candidates.length === 0) {
      console.log('No candidates found to notify');
      return;
    }

    for (const candidate of candidates) {
      console.log(`Sending email to: ${candidate.email}`);
      try {
        await this.transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: candidate.email,
          subject: `New Job Opportunity: ${job.title}`,
          text: `A new job "${job.title}" has been posted/updated. Location: ${job.location}, Skills: ${job.skills?.join(', ')}. Apply now!`,
        });
        console.log(`Email sent to ${candidate.email}`);
      } catch (error) {
        console.error(`Failed to send email to ${candidate.email}:`, error);
      }
    }
  }

  private async sendEmailNotification(to: string, subject: string, text: string): Promise<void> {
    console.log(`Sending email notification to: ${to}`);
    try {
      await this.transporter.sendMail({
        from: process.env.GMAIL_USER,
        to,
        subject,
        text,
      });
      console.log(`Email notification sent to ${to}`);
    } catch (error) {
      console.error(`Failed to send email notification to ${to}:`, error);
      throw error;
    }
  }
}