import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req, HttpCode, HttpStatus, SetMetadata } from '@nestjs/common';
import { RecruiterService } from './recruiter.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
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

  @Patch('profile')
  updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.recruiterService.updateProfile(req.user.id, updateProfileDto);
  }

  @Post('jobs')
  createJob(@Req() req, @Body() createJobDto: CreateJobDto) {
    return this.recruiterService.createJob(req.user.id, createJobDto);
  }

  @Patch('jobs/:id')
  updateJob(@Req() req, @Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.recruiterService.updateJob(req.user.id, +id, updateJobDto);
  }

  @Delete('jobs/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteJob(@Req() req, @Param('id') id: string) {
    return this.recruiterService.deleteJob(req.user.id, +id);
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
  @HttpCode(HttpStatus.OK) // Changed to 200 OK
  searchCandidates(@Body() searchCandidateDto: SearchCandidateDto) {
    return this.recruiterService.searchCandidates(searchCandidateDto);
  }

  @Post('messages')
  sendMessage(@Req() req, @Body() sendMessageDto: SendMessageDto) {
    return this.recruiterService.sendMessage(req.user.id, sendMessageDto);
  }
}