import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { ListJobsDto } from './dto/list-jobs.dto';
export declare class JobsService {
    private jobRepository;
    constructor(jobRepository: Repository<Job>);
    findAll(listJobsDto: ListJobsDto): Promise<Job[]>;
    findOne(id: number): Promise<Job>;
}
