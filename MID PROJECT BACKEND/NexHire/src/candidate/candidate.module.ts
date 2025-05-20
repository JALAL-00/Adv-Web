import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateController } from './candidate.controller';
import { CandidateService } from './candidate.service';
import { CandidateProfile } from './entities/candidate-profile.entity';
import { User } from '../auth/entities/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { ApplicationsService } from '../applications/applications.service';
import { Application } from '../applications/entities/application.entity';
import { JobsService } from '../jobs/jobs.service';
import { EmailService } from '../common/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([CandidateProfile, User, Job, Application])],
  controllers: [CandidateController],
  providers: [CandidateService, ApplicationsService, JobsService, EmailService],
})
export class CandidateModule {}