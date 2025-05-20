import { RecruiterService } from './recruiter.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { DeleteJobDto } from './dto/delete-job.dto';
import { SearchCandidateDto } from './dto/search-candidate.dto';
import { SendMessageDto } from './dto/send-message.dto';
export declare class RecruiterController {
    private recruiterService;
    constructor(recruiterService: RecruiterService);
    getProfile(req: any): Promise<import("./entities/recruiter-profile.entity").RecruiterProfile>;
    updateProfile(req: any, updateProfileDto: UpdateProfileDto): Promise<import("./entities/recruiter-profile.entity").RecruiterProfile>;
    createJob(req: any, createJobDto: CreateJobDto): Promise<import("../jobs/entities/job.entity").Job>;
    updateJob(req: any, updateJobDto: UpdateJobDto): Promise<import("../jobs/entities/job.entity").Job>;
    deleteJob(req: any, deleteJobDto: DeleteJobDto): Promise<{
        message: string;
    }>;
    listJobs(req: any): Promise<import("../jobs/entities/job.entity").Job[]>;
    viewApplications(req: any, id: string): Promise<any>;
    searchCandidates(searchCandidateDto: SearchCandidateDto): Promise<import("../candidate/entities/candidate-profile.entity").CandidateProfile[]>;
    sendMessage(req: any, sendMessageDto: SendMessageDto): Promise<import("./entities/message.entity").Message>;
}
