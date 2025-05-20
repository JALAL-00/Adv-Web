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
import * as fs from 'fs/promises';

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

  async uploadResume(userId: number, resumePath: string): Promise<CandidateProfile> {
    let profile = await this.profileRepository.findOne({ where: { user: { id: userId } } });
    if (!profile) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      profile = this.profileRepository.create({ user, resume: resumePath });
    } else {
      // Delete old resume if it exists
      if (profile.resume) {
        try {
          await fs.unlink(profile.resume);
        } catch (error) {
          console.error(`Failed to delete old resume at ${profile.resume}: ${error.message}`);
        }
      }
      profile.resume = resumePath;
    }
    return this.profileRepository.save(profile);
  }

  async deleteResume(userId: number): Promise<CandidateProfile> {
    const profile = await this.profileRepository.findOne({ where: { user: { id: userId } } });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    if (!profile.resume) {
      throw new BadRequestException('No resume to delete');
    }
    try {
      await fs.unlink(profile.resume);
    } catch (error) {
      console.error(`Failed to delete resume at ${profile.resume}: ${error.message}`);
      throw new BadRequestException('Failed to delete resume file');
    }
    profile.resume = '';
    return this.profileRepository.save(profile);
  }

  async searchJobs(searchJobsDto: SearchJobsDto): Promise<Job[]> {
    console.log('Simulating web scraping for jobs...');
    return this.jobsService.findAll(searchJobsDto);
  }

  async applyJob(userId: number, applyJobDto: ApplyJobDto): Promise<Application> {
    const profile = await this.profileRepository.findOne({ where: { user: { id: userId } } });
    if (!profile || !profile.resume) {
      throw new BadRequestException('Profile or resume not found');
    }
    return this.applicationsService.create(userId, applyJobDto.jobId, profile.resume, applyJobDto);
  }

  async getProfile(userId: number): Promise<CandidateProfile> {
    const profile = await this.profileRepository.findOne({ where: { user: { id: userId } }, relations: ['user'] });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }
}