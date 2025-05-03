"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const job_entity_1 = require("../jobs/entities/job.entity");
const application_entity_1 = require("../applications/entities/application.entity");
const message_entity_1 = require("../recruiter/entities/message.entity");
const candidate_profile_entity_1 = require("../candidate/entities/candidate-profile.entity");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const nodemailer = require("nodemailer");
let AuthService = class AuthService {
    userRepository;
    jobRepository;
    applicationRepository;
    messageRepository;
    profileRepository;
    jwtService;
    blacklistedTokenRepository;
    constructor(userRepository, jobRepository, applicationRepository, messageRepository, profileRepository, jwtService) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.messageRepository = messageRepository;
        this.profileRepository = profileRepository;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const { email, password, firstName, lastName, companyName } = registerDto;
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new common_1.BadRequestException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const role = companyName ? user_entity_1.UserRole.RECRUITER : user_entity_1.UserRole.CANDIDATE;
        const user = this.userRepository.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            companyName,
            role,
        });
        return this.userRepository.save(user);
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new common_1.BadRequestException('Invalid credentials');
        }
        const payload = { sub: user.id, email: user.email, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    async forgotPassword(forgotPasswordDto) {
        const { email } = forgotPasswordDto;
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const token = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 5 * 60 * 1000);
        user.resetPasswordToken = token;
        user.resetPasswordExpires = expires;
        await this.userRepository.save(user);
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });
        await transporter.sendMail({
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${token}. It expires in 5 minutes.`,
        });
    }
    async resetPassword(resetPasswordDto) {
        const { token, password } = resetPasswordDto;
        const user = await this.userRepository.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: (0, typeorm_2.MoreThan)(new Date()),
            },
        });
        if (!user) {
            throw new common_1.BadRequestException('Invalid or expired token');
        }
        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await this.userRepository.save(user);
    }
    async logout(token) {
        const decoded = this.jwtService.decode(token);
        if (!decoded) {
            throw new common_1.BadRequestException('Invalid token');
        }
        const blacklistedToken = this.blacklistedTokenRepository.create({
            token,
            expiresAt: new Date(decoded.exp * 1000),
        });
        await this.blacklistedTokenRepository.save(blacklistedToken);
    }
    async deleteAccount(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['candidateProfile', 'jobs', 'applications', 'sentMessages', 'receivedMessages'],
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.applications && user.applications.length > 0) {
            await this.applicationRepository.delete({ candidate: { id: userId } });
        }
        if (user.jobs && user.jobs.length > 0) {
            const jobIds = user.jobs.map(job => job.id);
            await this.applicationRepository.delete({ job: { id: (0, typeorm_2.In)(jobIds) } });
        }
        if (user.jobs && user.jobs.length > 0) {
            await this.jobRepository.delete({ recruiter: { id: userId } });
        }
        if (user.sentMessages && user.sentMessages.length > 0) {
            await this.messageRepository.delete({ sender: { id: userId } });
        }
        if (user.receivedMessages && user.receivedMessages.length > 0) {
            await this.messageRepository.delete({ receiver: { id: userId } });
        }
        if (user.candidateProfile) {
            await this.profileRepository.delete({ user: { id: userId } });
        }
        await this.userRepository.delete(userId);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __param(2, (0, typeorm_1.InjectRepository)(application_entity_1.Application)),
    __param(3, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __param(4, (0, typeorm_1.InjectRepository)(candidate_profile_entity_1.CandidateProfile)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map