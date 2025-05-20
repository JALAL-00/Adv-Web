import { Controller, Get, Post, Patch, Delete, Req, Body, UseGuards, UploadedFile, UseInterceptors, BadRequestException, SetMetadata } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CandidateService } from './candidate.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SearchJobsDto } from './dto/search-jobs.dto';
import { ApplyJobDto } from './dto/apply-job.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { UserRole } from '../auth/entities/user.entity';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('candidate')
@UseGuards(JwtAuthGuard, RoleGuard)
@SetMetadata('role', UserRole.CANDIDATE)
export class CandidateController {
  constructor(private candidateService: CandidateService) {}

  @Get('profile')
  getProfile(@Req() req) {
    return this.candidateService.getProfile(req.user.id);
  }

  @Patch('profile')
  updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.candidateService.updateProfile(req.user.id, updateProfileDto);
  }

  @Post('resume')
  @UseInterceptors(
    FileInterceptor('resume', {
      storage: diskStorage({
        destination: './Uploads/resumes',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = /\.(pdf|doc|docx)$/;
        if (!file.originalname.match(allowedTypes)) {
          return cb(new BadRequestException('Only PDF, DOC, DOCX files are allowed'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadResume(@Req() req, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    console.log(`Uploaded file: ${file.path}`);
    return this.candidateService.uploadResume(req.user.id, file.path);
  }

  @Delete('resume')
  async deleteResume(@Req() req) {
    const profile = await this.candidateService.deleteResume(req.user.id);
    return { message: 'Resume deleted successfully', resume: profile.resume };
  }

  @Post('search-jobs')
  searchJobs(@Body() searchJobsDto: SearchJobsDto) {
    return this.candidateService.searchJobs(searchJobsDto);
  }

  @Post('apply-job')
  applyJob(@Req() req, @Body() applyJobDto: ApplyJobDto) {
    return this.candidateService.applyJob(req.user.id, applyJobDto);
  }
}