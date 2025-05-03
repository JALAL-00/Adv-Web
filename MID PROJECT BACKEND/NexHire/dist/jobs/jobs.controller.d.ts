import { JobsService } from './jobs.service';
import { ListJobsDto } from './dto/list-jobs.dto';
export declare class JobsController {
    private jobsService;
    constructor(jobsService: JobsService);
    findAll(listJobsDto: ListJobsDto): Promise<import("./entities/job.entity").Job[]>;
}
