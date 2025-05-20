import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecruiterController } from './recruiter.controller';
import { RecruiterService } from './recruiter.service';
import { Job } from '../jobs/entities/job.entity';
import { User } from '../auth/entities/user.entity';
import { Message } from './entities/message.entity';
import { EmailService } from '../common/email.service';
import { ApplicationsService } from '../applications/applications.service';
import { Application } from '../applications/entities/application.entity';
import { ScreeningResult } from '../screening/entities/screening-result.entity';
import { CandidateProfile } from '../candidate/entities/candidate-profile.entity';
import { RecruiterProfile } from './entities/recruiter-profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Job,
      User,
      Message,
      Application,
      ScreeningResult,
      CandidateProfile,
      RecruiterProfile,
    ]),
  ],
  controllers: [RecruiterController],
  providers: [RecruiterService, EmailService, ApplicationsService],
})
export class RecruiterModule {}