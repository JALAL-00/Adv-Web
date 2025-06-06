import { CandidateService } from './candidate.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SearchJobsDto } from './dto/search-jobs.dto';
import { ApplyJobDto } from './dto/apply-job.dto';
export declare class CandidateController {
    private candidateService;
    constructor(candidateService: CandidateService);
    getProfile(req: any): Promise<import("./entities/candidate-profile.entity").CandidateProfile>;
    updateProfile(req: any, updateProfileDto: UpdateProfileDto): Promise<import("./entities/candidate-profile.entity").CandidateProfile>;
    uploadResume(req: any, file: Express.Multer.File): Promise<import("./entities/candidate-profile.entity").CandidateProfile>;
    deleteResume(req: any): Promise<{
        message: string;
        resume: string;
    }>;
    searchJobs(searchJobsDto: SearchJobsDto): Promise<import("../jobs/entities/job.entity").Job[]>;
    applyJob(req: any, applyJobDto: ApplyJobDto): Promise<import("../applications/entities/application.entity").Application>;
}
