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
exports.RecruiterController = void 0;
const common_1 = require("@nestjs/common");
const recruiter_service_1 = require("./recruiter.service");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const create_job_dto_1 = require("./dto/create-job.dto");
const update_job_dto_1 = require("./dto/update-job.dto");
const delete_job_dto_1 = require("./dto/delete-job.dto");
const search_candidate_dto_1 = require("./dto/search-candidate.dto");
const send_message_dto_1 = require("./dto/send-message.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const role_guard_1 = require("../auth/guards/role.guard");
const user_entity_1 = require("../auth/entities/user.entity");
let RecruiterController = class RecruiterController {
    recruiterService;
    constructor(recruiterService) {
        this.recruiterService = recruiterService;
    }
    getProfile(req) {
        return this.recruiterService.getProfile(req.user.id);
    }
    updateProfile(req, updateProfileDto) {
        return this.recruiterService.updateProfile(req.user.id, updateProfileDto);
    }
    createJob(req, createJobDto) {
        return this.recruiterService.createJob(req.user.id, createJobDto);
    }
    updateJob(req, updateJobDto) {
        return this.recruiterService.updateJob(req.user.id, updateJobDto.jobId, updateJobDto);
    }
    deleteJob(req, deleteJobDto) {
        return this.recruiterService.deleteJob(req.user.id, deleteJobDto.jobId);
    }
    listJobs(req) {
        return this.recruiterService.listJobs(req.user.id);
    }
    viewApplications(req, id) {
        return this.recruiterService.viewApplications(req.user.id, +id);
    }
    searchCandidates(searchCandidateDto) {
        return this.recruiterService.searchCandidates(searchCandidateDto);
    }
    sendMessage(req, sendMessageDto) {
        return this.recruiterService.sendMessage(req.user.id, sendMessageDto);
    }
};
exports.RecruiterController = RecruiterController;
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RecruiterController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)('profile'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", void 0)
], RecruiterController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Post)('jobs'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_job_dto_1.CreateJobDto]),
    __metadata("design:returntype", void 0)
], RecruiterController.prototype, "createJob", null);
__decorate([
    (0, common_1.Patch)('jobs'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_job_dto_1.UpdateJobDto]),
    __metadata("design:returntype", void 0)
], RecruiterController.prototype, "updateJob", null);
__decorate([
    (0, common_1.Delete)('jobs'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, delete_job_dto_1.DeleteJobDto]),
    __metadata("design:returntype", void 0)
], RecruiterController.prototype, "deleteJob", null);
__decorate([
    (0, common_1.Get)('jobs'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RecruiterController.prototype, "listJobs", null);
__decorate([
    (0, common_1.Get)('jobs/:id/applications'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], RecruiterController.prototype, "viewApplications", null);
__decorate([
    (0, common_1.Post)('search-candidates'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_candidate_dto_1.SearchCandidateDto]),
    __metadata("design:returntype", void 0)
], RecruiterController.prototype, "searchCandidates", null);
__decorate([
    (0, common_1.Post)('messages'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, send_message_dto_1.SendMessageDto]),
    __metadata("design:returntype", void 0)
], RecruiterController.prototype, "sendMessage", null);
exports.RecruiterController = RecruiterController = __decorate([
    (0, common_1.Controller)('recruiter'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RoleGuard),
    (0, common_1.SetMetadata)('role', user_entity_1.UserRole.RECRUITER),
    __metadata("design:paramtypes", [recruiter_service_1.RecruiterService])
], RecruiterController);
//# sourceMappingURL=recruiter.controller.js.map