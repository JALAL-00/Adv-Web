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
const user_entity_1 = require("../auth/entities/user.entity");
const job_entity_1 = require("../jobs/entities/job.entity");
const application_entity_1 = require("../applications/entities/application.entity");
const message_entity_1 = require("./entities/message.entity");
const nodemailer = require("nodemailer");
let RecruiterService = class RecruiterService {
    userRepository;
    jobRepository;
    applicationRepository;
    messageRepository;
    transporter;
    constructor(userRepository, jobRepository, applicationRepository, messageRepository) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.messageRepository = messageRepository;
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });
    }
    async updateProfile(userId, updateProfileDto) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        Object.assign(user, updateProfileDto);
        return this.userRepository.save(user);
    }
    async createJob(userId, createJobDto) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const job = this.jobRepository.create({ ...createJobDto, recruiter: user });
        const savedJob = await this.jobRepository.save(job);
        await this.notifyCandidates(savedJob);
        return savedJob;
    }
    async updateJob(userId, jobId, updateJobDto) {
        const job = await this.jobRepository.findOne({ where: { id: jobId, recruiter: { id: userId } } });
        if (!job) {
            throw new common_1.NotFoundException('Job not found or not authorized');
        }
        Object.assign(job, updateJobDto);
        const updatedJob = await this.jobRepository.save(job);
        await this.notifyCandidates(updatedJob);
        return updatedJob;
    }
    async deleteJob(userId, jobId) {
        const job = await this.jobRepository.findOne({ where: { id: jobId, recruiter: { id: userId } } });
        if (!job) {
            throw new common_1.NotFoundException('Job not found or not authorized');
        }
        await this.jobRepository.remove(job);
    }
    async listJobs(userId) {
        return this.jobRepository.find({ where: { recruiter: { id: userId } } });
    }
    async viewApplications(userId, jobId) {
        const job = await this.jobRepository.findOne({ where: { id: jobId, recruiter: { id: userId } } });
        if (!job) {
            throw new common_1.NotFoundException('Job not found or not authorized');
        }
        return this.applicationRepository.find({ where: { job: { id: jobId } }, relations: ['candidate'] });
    }
    async searchCandidates(searchCandidateDto) {
        const { title, skills, experience, location } = searchCandidateDto;
        return this.userRepository.find({
            where: {
                role: user_entity_1.UserRole.CANDIDATE,
                ...(title && { firstName: (0, typeorm_2.Like)(`%${title}%`) }),
                ...(location && { phone: (0, typeorm_2.Like)(`%${location}%`) }),
            },
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
    async notifyCandidates(job) {
        console.log('Notifying candidates for job:', job.title, 'Skills:', job.skills);
        const candidates = await this.userRepository.find({
            where: { role: user_entity_1.UserRole.CANDIDATE },
        });
        console.log('Found candidates:', candidates.length, candidates.map(c => c.email));
        if (candidates.length === 0) {
            console.log('No candidates found to notify');
            return;
        }
        for (const candidate of candidates) {
            console.log(`Sending email to: ${candidate.email}`);
            try {
                await this.transporter.sendMail({
                    from: process.env.GMAIL_USER,
                    to: candidate.email,
                    subject: `New Job Opportunity: ${job.title}`,
                    text: `A new job "${job.title}" has been posted/updated. Location: ${job.location}, Skills: ${job.skills?.join(', ')}. Apply now!`,
                });
                console.log(`Email sent to ${candidate.email}`);
            }
            catch (error) {
                console.error(`Failed to send email to ${candidate.email}:`, error);
            }
        }
    }
    async sendEmailNotification(to, subject, text) {
        console.log(`Sending email notification to: ${to}`);
        try {
            await this.transporter.sendMail({
                from: process.env.GMAIL_USER,
                to,
                subject,
                text,
            });
            console.log(`Email notification sent to ${to}`);
        }
        catch (error) {
            console.error(`Failed to send email notification to ${to}:`, error);
            throw error;
        }
    }
};
exports.RecruiterService = RecruiterService;
exports.RecruiterService = RecruiterService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __param(2, (0, typeorm_1.InjectRepository)(application_entity_1.Application)),
    __param(3, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RecruiterService);
//# sourceMappingURL=recruiter.service.js.map