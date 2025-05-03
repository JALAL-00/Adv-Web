import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CandidateProfile } from './entities/candidate-profile.entity';
import { User, UserRole } from '../auth/entities/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SearchJobsDto } from './dto/search-jobs.dto';
import { ApplyJobDto } from './dto/apply-job.dto';
import { ApplicationsService } from '../applications/applications.service';
import { JobsService } from '../jobs/jobs.service';
import { Application } from '../applications/entities/application.entity';

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(CandidateProfile)
    private profileRepository: Repository<CandidateProfile>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    private applicationsService: ApplicationsService,
    private jobsService: JobsService,
  ) {}

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<CandidateProfile> {
    let profile = await this.profileRepository.findOne({ where: { user: { id: userId } } });
    if (!profile) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      profile = this.profileRepository.create({ user, ...updateProfileDto });
    } else {
      Object.assign(profile, updateProfileDto);
    }
    return this.profileRepository.save(profile);
  }

  async uploadResume(userId: number, resumePath: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    user.resume = resumePath;
    return this.userRepository.save(user);
  }

  async searchJobs(searchJobsDto: SearchJobsDto): Promise<Job[]> {
    // Simulated web scraping: In a real app, this would fetch external job listings
    console.log('Simulating web scraping for jobs...');
    return this.jobsService.findAll(searchJobsDto);
  }

  async applyJob(userId: number, jobId: number, applyJobDto: ApplyJobDto): Promise<Application> {
    const profile = await this.profileRepository.findOne({ where: { user: { id: userId } } });
    if (!profile || !profile.resume) {
      throw new BadRequestException('Profile or resume not found');
    }
    const applicationDto = { ...applyJobDto, jobId };
    return this.applicationsService.create(userId, jobId, profile.resume, applicationDto);
  }

  async getProfile(userId: number): Promise<CandidateProfile> {
    const profile = await this.profileRepository.findOne({ where: { user: { id: userId } }, relations: ['user'] });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }
}