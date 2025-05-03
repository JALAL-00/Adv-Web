import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RecruiterModule } from './recruiter/recruiter.module';
import { JobsModule } from './jobs/jobs.module';
import { ApplicationsModule } from './applications/applications.module';
import { CandidateModule } from './candidate/candidate.module';
import { ScraperModule } from './scraper/scraper.module';
import { ScreeningModule } from './screening/screening.module';
import { EmailService } from './common/email.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +(process.env.DATABASE_PORT || '5432'),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true, // Set to false in production
    }),
    AuthModule,
    JobsModule,
    RecruiterModule,
    CandidateModule,
    ApplicationsModule,
    ScraperModule,
    ScreeningModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule {}