import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserRole } from './entities/user.entity';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        companyName: string;
        phone: string;
        role: UserRole;
        resetPasswordToken: string | null;
        resetPasswordExpires: Date | null;
        resume: string;
        candidateProfile: import("../candidate/entities/candidate-profile.entity").CandidateProfile;
        recruiterProfile: import("../recruiter/entities/recruiter-profile.entity").RecruiterProfile;
        jobs: import("../jobs/entities/job.entity").Job[];
        applications: import("../applications/entities/application.entity").Application[];
        sentMessages: import("../recruiter/entities/message.entity").Message[];
        receivedMessages: import("../recruiter/entities/message.entity").Message[];
        scrapedJobs: import("../scraper/entities/scraped-job.entity").ScrapedJob[];
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    logout(token: string): Promise<{
        message: string;
    }>;
    deleteAccount(req: any): Promise<{
        message: string;
    }>;
}
