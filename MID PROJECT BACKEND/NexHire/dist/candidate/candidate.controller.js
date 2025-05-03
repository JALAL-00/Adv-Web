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
exports.CandidateController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const candidate_service_1 = require("./candidate.service");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const search_jobs_dto_1 = require("./dto/search-jobs.dto");
const apply_job_dto_1 = require("./dto/apply-job.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const role_guard_1 = require("../auth/guards/role.guard");
const user_entity_1 = require("../auth/entities/user.entity");
const multer_1 = require("multer");
const path_1 = require("path");
let CandidateController = class CandidateController {
    candidateService;
    constructor(candidateService) {
        this.candidateService = candidateService;
    }
    getProfile(req) {
        return this.candidateService.getProfile(req.user.id);
    }
    updateProfile(req, updateProfileDto) {
        return this.candidateService.updateProfile(req.user.id, updateProfileDto);
    }
    async uploadResume(req, file) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        console.log(`Uploaded file: ${file.path}`);
        return this.candidateService.uploadResume(req.user.id, file.path);
    }
    searchJobs(searchJobsDto) {
        return this.candidateService.searchJobs(searchJobsDto);
    }
    applyJob(req, id, applyJobDto) {
        return this.candidateService.applyJob(req.user.id, +id, applyJobDto);
    }
};
exports.CandidateController = CandidateController;
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CandidateController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)('profile'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", void 0)
], CandidateController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Post)('resume'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('resume', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/resumes',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname);
                cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            const allowedTypes = /\.(pdf|doc|docx)$/;
            if (!file.originalname.match(allowedTypes)) {
                return cb(new common_1.BadRequestException('Only PDF, DOC, DOCX files are allowed'), false);
            }
            cb(null, true);
        },
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CandidateController.prototype, "uploadResume", null);
__decorate([
    (0, common_1.Post)('search-jobs'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_jobs_dto_1.SearchJobsDto]),
    __metadata("design:returntype", void 0)
], CandidateController.prototype, "searchJobs", null);
__decorate([
    (0, common_1.Post)('jobs/:id/apply'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, apply_job_dto_1.ApplyJobDto]),
    __metadata("design:returntype", void 0)
], CandidateController.prototype, "applyJob", null);
exports.CandidateController = CandidateController = __decorate([
    (0, common_1.Controller)('candidate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    (0, common_1.SetMetadata)('role', user_entity_1.UserRole.CANDIDATE),
    __metadata("design:paramtypes", [candidate_service_1.CandidateService])
], CandidateController);
//# sourceMappingURL=candidate.controller.js.map