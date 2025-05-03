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
exports.ScreeningService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const screening_result_entity_1 = require("./entities/screening-result.entity");
const job_entity_1 = require("../jobs/entities/job.entity");
const application_entity_1 = require("../applications/entities/application.entity");
const user_entity_1 = require("../auth/entities/user.entity");
const email_service_1 = require("../common/email.service");
const resume_parser_util_1 = require("../common/resume-parser.util");
let ScreeningService = class ScreeningService {
    screeningResultRepository;
    jobRepository;
    applicationRepository;
    userRepository;
    emailService;
    constructor(screeningResultRepository, jobRepository, applicationRepository, userRepository, emailService) {
        this.screeningResultRepository = screeningResultRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }
    async screenResumes(jobId) {
        const job = await this.jobRepository.findOne({ where: { id: jobId }, relations: ['recruiter'] });
        if (!job)
            throw new common_1.NotFoundException('Job not found');
        const applications = await this.applicationRepository.find({
            where: { job: { id: jobId } },
            relations: ['candidate'],
        });
        if (!applications.length)
            throw new common_1.NotFoundException('No applications found for this job');
        const results = [];
        const jobText = `${job.description} ${job.skills?.join(' ')}`.toLowerCase();
        const jobKeywords = jobText.split(/\W+/).filter(Boolean);
        const uniqueKeywords = [...new Set(jobKeywords)];
        for (const application of applications) {
            if (!application.resume)
                continue;
            try {
                const resumeText = await resume_parser_util_1.ResumeParser.parseResume(application.resume);
                const resumeWords = resumeText.toLowerCase().split(/\W+/).filter(Boolean);
                const matchedKeywords = uniqueKeywords.filter((keyword) => resumeWords.includes(keyword));
                const score = (matchedKeywords.length / uniqueKeywords.length) * 100;
                const result = this.screeningResultRepository.create({
                    job,
                    candidate: application.candidate,
                    score,
                    matchedKeywords,
                });
                results.push(await this.screeningResultRepository.save(result));
            }
            catch (error) {
                console.error(`Failed to process resume for candidate ${application.candidate.id}: ${error.message}`);
            }
        }
        if (results.length > 0) {
            const topCandidate = results[0];
            await this.emailService.sendMail(job.recruiter.email, `Screening Results for Job: ${job.title}`, `Screening completed for "${job.title}". Top candidate score: ${topCandidate.score.toFixed(2)}% with keywords: ${topCandidate.matchedKeywords.join(', ')}.`);
        }
        return results.sort((a, b) => b.score - a.score);
    }
};
exports.ScreeningService = ScreeningService;
exports.ScreeningService = ScreeningService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(screening_result_entity_1.ScreeningResult)),
    __param(1, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __param(2, (0, typeorm_1.InjectRepository)(application_entity_1.Application)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        email_service_1.EmailService])
], ScreeningService);
//# sourceMappingURL=screening.service.js.map