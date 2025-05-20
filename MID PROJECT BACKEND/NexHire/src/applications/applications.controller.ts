import { Controller, Get, Patch, Req, Body, UseGuards, SetMetadata } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { UserRole } from '../auth/entities/user.entity';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';

@Controller('applications')
@UseGuards(JwtAuthGuard, RoleGuard)
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Get()
  @SetMetadata('role', UserRole.CANDIDATE)
  findByCandidate(@Req() req) {
    return this.applicationsService.findByCandidate(req.user.id);
  }

  @Patch('status')
  @SetMetadata('role', UserRole.RECRUITER)
  updateStatus(@Body() updateApplicationStatusDto: UpdateApplicationStatusDto) {
    return this.applicationsService.updateStatus(
      updateApplicationStatusDto.applicationId,
      updateApplicationStatusDto.status,
    );
  }
}