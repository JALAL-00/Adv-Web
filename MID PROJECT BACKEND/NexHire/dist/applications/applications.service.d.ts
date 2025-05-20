import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { User } from '../auth/entities/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { EmailService } from '../common/email.service';
export declare class ApplicationsService {
    private applicationRepository;
    private userRepository;
    private jobRepository;
    private emailService;
    constructor(applicationRepository: Repository<Application>, userRepository: Repository<User>, jobRepository: Repository<Job>, emailService: EmailService);
    create(userId: number, jobId: number, resume: string, createApplicationDto: CreateApplicationDto): Promise<Application>;
    findByCandidate(userId: number): Promise<Application[]>;
    getAllApplications(recruiterId: number): Promise<Application[]>;
    updateStatus(applicationId: number, status: string): Promise<Application>;
    private notifyRecruiter;
}
