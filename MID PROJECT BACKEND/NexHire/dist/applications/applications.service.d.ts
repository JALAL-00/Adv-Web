import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { User } from '../auth/entities/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
export declare class ApplicationsService {
    private applicationRepository;
    private userRepository;
    private jobRepository;
    apply(createApplicationDto: CreateApplicationDto, user: any): void;
    constructor(applicationRepository: Repository<Application>, userRepository: Repository<User>, jobRepository: Repository<Job>);
    create(userId: number, jobId: number, resume: string, createApplicationDto: CreateApplicationDto): Promise<Application>;
    findByCandidate(userId: number): Promise<Application[]>;
    getAllApplications(recruiterId: number): Promise<Application[]>;
    private notifyRecruiter;
}
