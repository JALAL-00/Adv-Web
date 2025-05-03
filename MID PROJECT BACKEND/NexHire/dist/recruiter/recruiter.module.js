"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecruiterModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../auth/entities/user.entity");
const job_entity_1 = require("../jobs/entities/job.entity");
const application_entity_1 = require("../applications/entities/application.entity");
const message_entity_1 = require("./entities/message.entity");
const candidate_profile_entity_1 = require("../candidate/entities/candidate-profile.entity");
const recruiter_controller_1 = require("./recruiter.controller");
const recruiter_service_1 = require("./recruiter.service");
let RecruiterModule = class RecruiterModule {
};
exports.RecruiterModule = RecruiterModule;
exports.RecruiterModule = RecruiterModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, job_entity_1.Job, application_entity_1.Application, message_entity_1.Message, candidate_profile_entity_1.CandidateProfile])],
        controllers: [recruiter_controller_1.RecruiterController],
        providers: [recruiter_service_1.RecruiterService],
    })
], RecruiterModule);
//# sourceMappingURL=recruiter.module.js.map