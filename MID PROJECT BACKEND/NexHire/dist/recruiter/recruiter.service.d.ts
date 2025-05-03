import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { Job } from '../jobs/entities/job.entity';
import { Application } from '../applications/entities/application.entity';
import { Message } from './entities/message.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { SearchCandidateDto } from './dto/search-candidate.dto';
import { SendMessageDto } from './dto/send-message.dto';
export declare class RecruiterService {
    private userRepository;
    private jobRepository;
    private applicationRepository;
    private messageRepository;
    private transporter;
    constructor(userRepository: Repository<User>, jobRepository: Repository<Job>, applicationRepository: Repository<Application>, messageRepository: Repository<Message>);
    updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<User>;
    createJob(userId: number, createJobDto: CreateJobDto): Promise<Job>;
    updateJob(userId: number, jobId: number, updateJobDto: UpdateJobDto): Promise<Job>;
    deleteJob(userId: number, jobId: number): Promise<void>;
    listJobs(userId: number): Promise<Job[]>;
    viewApplications(userId: number, jobId: number): Promise<Application[]>;
    searchCandidates(searchCandidateDto: SearchCandidateDto): Promise<User[]>;
    sendMessage(userId: number, sendMessageDto: SendMessageDto): Promise<Message>;
    private notifyCandidates;
    private sendEmailNotification;
}
