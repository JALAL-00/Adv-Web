import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { User } from '../auth/entities/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class ApplicationsService {
  apply(createApplicationDto: CreateApplicationDto, user: any) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}

  async create(userId: number, jobId: number, resume: string, createApplicationDto: CreateApplicationDto): Promise<Application> {
    const candidate = await this.userRepository.findOne({ where: { id: userId } });
    const job = await this.jobRepository.findOne({ where: { id: jobId }, relations: ['recruiter'] });
    if (!candidate || !job) {
      throw new NotFoundException('Candidate or job not found');
    }
    const application = this.applicationRepository.create({
      job,
      candidate,
      resume,
      coverLetter: createApplicationDto.coverLetter,
      status: 'pending',
    });
    const savedApplication = await this.applicationRepository.save(application);
    await this.notifyRecruiter(job.recruiter.email, job.title, candidate.email);
    return savedApplication;
  }

  async findByCandidate(userId: number): Promise<Application[]> {
    return this.applicationRepository.find({
      where: { candidate: { id: userId } },
      relations: ['job', 'job.recruiter'],
    });
  }

  async getAllApplications(recruiterId: number): Promise<Application[]> {
    return this.applicationRepository.find({
      where: { job: { recruiter: { id: recruiterId } } },
      relations: ['job', 'candidate'],
    });
  }

  private async notifyRecruiter(recruiterEmail: string, jobTitle: string, candidateEmail: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: recruiterEmail,
      subject: `New Application for ${jobTitle}`,
      text: `A candidate (${candidateEmail}) has applied for your job "${jobTitle}".`,
    });
  }
}