import { User } from '../../auth/entities/user.entity';
import { Job } from '../../jobs/entities/job.entity';
export declare class Application {
    id: number;
    job: Job;
    candidate: User;
    resume: string;
    coverLetter: string;
    status: string;
}
