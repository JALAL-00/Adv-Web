import { User } from '../../auth/entities/user.entity';
export declare class Job {
    id: number;
    title: string;
    description: string;
    location: string;
    salary: string;
    skills: string[];
    experience: string;
    recruiter: User;
}
