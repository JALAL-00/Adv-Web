import { Controller, Post, Body } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { ListJobsDto } from './dto/list-jobs.dto';

@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Post()
  findAll(@Body() listJobsDto: ListJobsDto) {
    return this.jobsService.findAll(listJobsDto);
  }
}