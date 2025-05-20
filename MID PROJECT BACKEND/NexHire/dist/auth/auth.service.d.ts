import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Job } from '../jobs/entities/job.entity';
import { Application } from '../applications/entities/application.entity';
import { Message } from '../recruiter/entities/message.entity';
import { CandidateProfile } from '../candidate/entities/candidate-profile.entity';
import { RecruiterProfile } from '../recruiter/entities/recruiter-profile.entity';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private userRepository;
    private jobRepository;
    private applicationRepository;
    private messageRepository;
    private profileRepository;
    private recruiterProfileRepository;
    private jwtService;
    private readonly blockedEmailDomains;
    constructor(userRepository: Repository<User>, jobRepository: Repository<Job>, applicationRepository: Repository<Application>, messageRepository: Repository<Message>, profileRepository: Repository<CandidateProfile>, recruiterProfileRepository: Repository<RecruiterProfile>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<User>;
    validateUser(email: string, password: string): Promise<User | null>;
    login(user: User): Promise<{
        access_token: string;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    logout(token: string): Promise<void>;
    deleteAccount(userId: number): Promise<{
        message: string;
    }>;
}
