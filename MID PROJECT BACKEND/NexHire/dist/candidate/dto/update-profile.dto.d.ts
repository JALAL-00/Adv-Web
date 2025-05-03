export declare class UpdateProfileDto {
    skills?: string[];
    experience?: string;
    education?: {
        institution: string;
        degree: string;
        year: number;
    }[];
    isVisible?: boolean;
}
