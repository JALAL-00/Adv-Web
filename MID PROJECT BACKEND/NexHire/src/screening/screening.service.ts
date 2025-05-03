import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScreeningResult } from './entities/screening-result.entity';
import { Job } from '../jobs/entities/job.entity';
import { Application } from '../applications/entities/application.entity';
import { User } from '../auth/entities/user.entity';
import { EmailService } from '../common/email.service';
import { ResumeParser } from '../common/resume-parser.util';

@Injectable()
export class ScreeningService {
  constructor(
    @InjectRepository(ScreeningResult)
    private screeningResultRepository: Repository<ScreeningResult>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private emailService: EmailService,
  ) {}

  async screenResumes(jobId: number): Promise<ScreeningResult[]> {
    const job = await this.jobRepository.findOne({ where: { id: jobId }, relations: ['recruiter'] });
    if (!job) throw new NotFoundException('Job not found');

    const applications = await this.applicationRepository.find({
      where: { job: { id: jobId } },
      relations: ['candidate'],
    });
    if (!applications.length) throw new NotFoundException('No applications found for this job');

    const results: ScreeningResult[] = [];
    // Combine job description and skills for keywords
    const jobText = `${job.description} ${job.skills?.join(' ')}`.toLowerCase();
    const jobKeywords = jobText.split(/\W+/).filter(Boolean);
    const uniqueKeywords = [...new Set(jobKeywords)];

    for (const application of applications) {
      if (!application.resume) continue;
      try {
        const resumeText = await ResumeParser.parseResume(application.resume);
        const resumeWords = resumeText.toLowerCase().split(/\W+/).filter(Boolean);
        const matchedKeywords = uniqueKeywords.filter((keyword) => resumeWords.includes(keyword));
        const score = (matchedKeywords.length / uniqueKeywords.length) * 100;

        const result = this.screeningResultRepository.create({
          job,
          candidate: application.candidate,
          score,
          matchedKeywords,
        });
        results.push(await this.screeningResultRepository.save(result));
      } catch (error) {
        console.error(`Failed to process resume for candidate ${application.candidate.id}: ${error.message}`);
      }
    }

    // Notify recruiter
    if (results.length > 0) {
      const topCandidate = results[0];
      await this.emailService.sendMail(
        job.recruiter.email,
        `Screening Results for Job: ${job.title}`,
        `Screening completed for "${job.title}". Top candidate score: ${topCandidate.score.toFixed(2)}% with keywords: ${topCandidate.matchedKeywords.join(', ')}.`,
      );
    }

    return results.sort((a, b) => b.score - a.score);
  }
}