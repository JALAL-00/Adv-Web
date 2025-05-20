import { Controller, Get, Post, Patch, Delete, Body, UseGuards, Req, HttpCode, HttpStatus, SetMetadata, Param } from '@nestjs/common';
import { RecruiterService } from './recruiter.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { DeleteJobDto } from './dto/delete-job.dto';
import { SearchCandidateDto } from './dto/search-candidate.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { UserRole } from '../auth/entities/user.entity';

@Controller('recruiter')
@UseGuards(JwtAuthGuard, RoleGuard)
@SetMetadata('role', UserRole.RECRUITER)
export class RecruiterController {
  constructor(private recruiterService: RecruiterService) {}

  @Get('profile')
  getProfile(@Req() req) {
    return this.recruiterService.getProfile(req.user.id);
  }

  @Patch('profile')
  updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.recruiterService.updateProfile(req.user.id, updateProfileDto);
  }

  @Post('jobs')
  createJob(@Req() req, @Body() createJobDto: CreateJobDto) {
    return this.recruiterService.createJob(req.user.id, createJobDto);
  }

  @Patch('jobs')
  updateJob(@Req() req, @Body() updateJobDto: UpdateJobDto) {
    return this.recruiterService.updateJob(req.user.id, updateJobDto.jobId, updateJobDto);
  }

  @Delete('jobs')
  deleteJob(@Req() req, @Body() deleteJobDto: DeleteJobDto) {
    return this.recruiterService.deleteJob(req.user.id, deleteJobDto.jobId);
  }

  @Get('jobs')
  listJobs(@Req() req) {
    return this.recruiterService.listJobs(req.user.id);
  }

  @Get('jobs/:id/applications')
  viewApplications(@Req() req, @Param('id') id: string) {
    return this.recruiterService.viewApplications(req.user.id, +id);
  }

  @Post('search-candidates')
  @HttpCode(HttpStatus.OK)
  searchCandidates(@Body() searchCandidateDto: SearchCandidateDto) {
    return this.recruiterService.searchCandidates(searchCandidateDto);
  }

  @Post('messages')
  sendMessage(@Req() req, @Body() sendMessageDto: SendMessageDto) {
    return this.recruiterService.sendMessage(req.user.id, sendMessageDto);
  }
}