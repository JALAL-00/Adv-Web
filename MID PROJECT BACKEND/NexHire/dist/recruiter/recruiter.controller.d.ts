import { RecruiterService } from './recruiter.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { SearchCandidateDto } from './dto/search-candidate.dto';
import { SendMessageDto } from './dto/send-message.dto';
export declare class RecruiterController {
    private recruiterService;
    constructor(recruiterService: RecruiterService);
    updateProfile(req: any, updateProfileDto: UpdateProfileDto): Promise<import("../auth/entities/user.entity").User>;
    createJob(req: any, createJobDto: CreateJobDto): Promise<import("../jobs/entities/job.entity").Job>;
    updateJob(req: any, id: string, updateJobDto: UpdateJobDto): Promise<import("../jobs/entities/job.entity").Job>;
    deleteJob(req: any, id: string): Promise<void>;
    listJobs(req: any): Promise<import("../jobs/entities/job.entity").Job[]>;
    viewApplications(req: any, id: string): Promise<import("../applications/entities/application.entity").Application[]>;
    searchCandidates(searchCandidateDto: SearchCandidateDto): Promise<import("../auth/entities/user.entity").User[]>;
    sendMessage(req: any, sendMessageDto: SendMessageDto): Promise<import("./entities/message.entity").Message>;
}
