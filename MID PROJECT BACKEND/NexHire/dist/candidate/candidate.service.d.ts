import { Repository } from 'typeorm';
import { CandidateProfile } from './entities/candidate-profile.entity';
import { User } from '../auth/entities/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SearchJobsDto } from './dto/search-jobs.dto';
import { ApplyJobDto } from './dto/apply-job.dto';
import { ApplicationsService } from '../applications/applications.service';
import { JobsService } from '../jobs/jobs.service';
import { Application } from '../applications/entities/application.entity';
export declare class CandidateService {
    private profileRepository;
    private userRepository;
    private jobRepository;
    private applicationsService;
    private jobsService;
    constructor(profileRepository: Repository<CandidateProfile>, userRepository: Repository<User>, jobRepository: Repository<Job>, applicationsService: ApplicationsService, jobsService: JobsService);
    updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<CandidateProfile>;
    uploadResume(userId: number, resumePath: string): Promise<CandidateProfile>;
    deleteResume(userId: number): Promise<CandidateProfile>;
    searchJobs(searchJobsDto: SearchJobsDto): Promise<Job[]>;
    applyJob(userId: number, applyJobDto: ApplyJobDto): Promise<Application>;
    getProfile(userId: number): Promise<CandidateProfile>;
}
