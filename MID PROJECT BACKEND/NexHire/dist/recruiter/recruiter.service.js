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
exports.RecruiterService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const job_entity_1 = require("../jobs/entities/job.entity");
const user_entity_1 = require("../auth/entities/user.entity");
const message_entity_1 = require("./entities/message.entity");
const email_service_1 = require("../common/email.service");
const applications_service_1 = require("../applications/applications.service");
const screening_result_entity_1 = require("../screening/entities/screening-result.entity");
const candidate_profile_entity_1 = require("../candidate/entities/candidate-profile.entity");
const recruiter_profile_entity_1 = require("./entities/recruiter-profile.entity");
let RecruiterService = class RecruiterService {
    jobRepository;
    userRepository;
    messageRepository;
    candidateProfileRepository;
    screeningResultRepository;
    recruiterProfileRepository;
    emailService;
    applicationsService;
    constructor(jobRepository, userRepository, messageRepository, candidateProfileRepository, screeningResultRepository, recruiterProfileRepository, emailService, applicationsService) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.messageRepository = messageRepository;
        this.candidateProfileRepository = candidateProfileRepository;
        this.screeningResultRepository = screeningResultRepository;
        this.recruiterProfileRepository = recruiterProfileRepository;
        this.emailService = emailService;
        this.applicationsService = applicationsService;
    }
    async getProfile(userId) {
        const profile = await this.recruiterProfileRepository.findOne({
            where: { user: { id: userId } },
            relations: ['user'],
        });
        if (!profile) {
            throw new common_1.NotFoundException('Profile not found');
        }
        return profile;
    }
    async updateProfile(userId, updateProfileDto) {
        let profile = await this.recruiterProfileRepository.findOne({ where: { user: { id: userId } } });
        if (!profile) {
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            profile = this.recruiterProfileRepository.create({ user, ...updateProfileDto });
        }
        else {
            Object.assign(profile, updateProfileDto);
        }
        return this.recruiterProfileRepository.save(profile);
    }
    async createJob(userId, createJobDto) {
        const recruiter = await this.userRepository.findOne({ where: { id: userId } });
        if (!recruiter) {
            throw new common_1.NotFoundException('Recruiter not found');
        }
        const job = this.jobRepository.create({ ...createJobDto, recruiter });
        const savedJob = await this.jobRepository.save(job);
        await this.notifyCandidates(savedJob);
        return savedJob;
    }
    async updateJob(userId, jobId, updateJobDto) {
        const job = await this.jobRepository.findOne({ where: { id: jobId, recruiter: { id: userId } } });
        if (!job) {
            throw new common_1.NotFoundException('Job not found or not authorized');
        }
        const { jobId: _, ...updateData } = updateJobDto;
        Object.assign(job, updateData);
        return this.jobRepository.save(job);
    }
    async deleteJob(userId, jobId) {
        const job = await this.jobRepository.findOne({ where: { id: jobId, recruiter: { id: userId } } });
        if (!job) {
            throw new common_1.NotFoundException('Job not found or not authorized');
        }
        await this.screeningResultRepository.delete({ job: { id: jobId } });
        await this.jobRepository.remove(job);
        return { message: 'Job deleted successfully' };
    }
    async listJobs(userId) {
        return this.jobRepository.find({ where: { recruiter: { id: userId } } });
    }
    async viewApplications(userId, jobId) {
        const job = await this.jobRepository.findOne({ where: { id: jobId, recruiter: { id: userId } } });
        if (!job) {
            throw new common_1.NotFoundException('Job not found or not authorized');
        }
        return this.applicationsService.getAllApplications(userId);
    }
    async searchCandidates(searchCandidateDto) {
        const { title, skills, location } = searchCandidateDto;
        return this.candidateProfileRepository.find({
            where: {
                ...(title && { firstName: (0, typeorm_2.Like)(`%${title}%`) }),
                ...(skills && { skills: (0, typeorm_2.Like)(`%${skills}%`) }),
                ...(location && { phone: (0, typeorm_2.Like)(`%${location}%`) }),
            },
            relations: ['user'],
        });
    }
    async sendMessage(userId, sendMessageDto) {
        const { receiverId, content } = sendMessageDto;
        const sender = await this.userRepository.findOne({ where: { id: userId } });
        const receiver = await this.userRepository.findOne({ where: { id: receiverId, role: user_entity_1.UserRole.CANDIDATE } });
        if (!sender || !receiver) {
            throw new common_1.NotFoundException('Sender or receiver not found');
        }
        const message = this.messageRepository.create({ content, sender, receiver });
        await this.sendEmailNotification(receiver.email, 'New Message', `You received a message: ${content}`);
        return this.messageRepository.save(message);
    }
    async sendEmailNotification(email, subject, message) {
        console.log(`Sending email notification to: ${email}`);
        await this.emailService.sendMail(email, subject, message);
        console.log(`Email notification sent to ${email}`);
    }
    async notifyCandidates(job) {
        const candidates = await this.userRepository.find({ where: { role: user_entity_1.UserRole.CANDIDATE } });
        for (const candidate of candidates) {
            await this.sendEmailNotification(candidate.email, `New Job Opportunity: ${job.title}`, `A new job "${job.title}" has been posted. Location: ${job.location}, Salary: ${job.salary}.`);
        }
    }
};
exports.RecruiterService = RecruiterService;
exports.RecruiterService = RecruiterService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __param(3, (0, typeorm_1.InjectRepository)(candidate_profile_entity_1.CandidateProfile)),
    __param(4, (0, typeorm_1.InjectRepository)(screening_result_entity_1.ScreeningResult)),
    __param(5, (0, typeorm_1.InjectRepository)(recruiter_profile_entity_1.RecruiterProfile)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        email_service_1.EmailService,
        applications_service_1.ApplicationsService])
], RecruiterService);
//# sourceMappingURL=recruiter.service.js.map