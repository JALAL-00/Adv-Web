import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateProfile } from './entities/candidate-profile.entity';
import { User } from '../auth/entities/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { CandidateController } from './candidate.controller';
import { CandidateService } from './candidate.service';
import { ApplicationsService } from '../applications/applications.service';
import { JobsService } from '../jobs/jobs.service';
import { Application } from '../applications/entities/application.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CandidateProfile, User, Job, Application])],
  controllers: [CandidateController],
  providers: [CandidateService, ApplicationsService, JobsService],
})
export class CandidateModule {}