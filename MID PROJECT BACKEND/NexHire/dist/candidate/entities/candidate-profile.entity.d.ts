import { User } from '../../auth/entities/user.entity';
export declare class CandidateProfile {
    id: number;
    user: User;
    skills: string[];
    experience: string;
    education: {
        institution: string;
        degree: string;
        year: number;
    }[];
    resume: string;
    isVisible: boolean;
}
