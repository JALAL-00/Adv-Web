import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Job } from './entities/job.entity';
import { ListJobsDto } from './dto/list-jobs.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}

  async findAll(listJobsDto: ListJobsDto): Promise<Job[]> {
    const { location, skills, salary } = listJobsDto;
    return this.jobRepository.find({
      where: {
        ...(location && { location: Like(`%${location}%`) }),
        ...(skills && { skills: Like(`%${skills[0]}%`) }), // Simplified
        ...(salary && { salary: Like(`%${salary}%`) }),
      },
      relations: ['recruiter'],
    });
  }

  async findOne(id: number): Promise<Job> {
    const job = await this.jobRepository.findOne({ where: { id }, relations: ['recruiter'] });
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
    return job;
  }
}