import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { User } from '../auth/entities/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { EmailService } from '../common/email.service';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    private emailService: EmailService,
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

  async updateStatus(applicationId: number, status: string): Promise<Application> {
    const application = await this.applicationRepository.findOne({
      where: { id: applicationId },
      relations: ['candidate', 'job'],
    });
    if (!application) {
      throw new NotFoundException('Application not found');
    }
    application.status = status;
    const updatedApplication = await this.applicationRepository.save(application);
    await this.emailService.sendMail(
      application.candidate.email,
      `Application Status Update for ${application.job.title}`,
      `Your application for "${application.job.title}" has been updated to "${status}".`,
    );
    return updatedApplication;
  }

  private async notifyRecruiter(recruiterEmail: string, jobTitle: string, candidateEmail: string): Promise<void> {
    await this.emailService.sendMail(
      recruiterEmail,
      `New Application for ${jobTitle}`,
      `A candidate (${candidateEmail}) has applied for your job "${jobTitle}".`,
    );
  }
}