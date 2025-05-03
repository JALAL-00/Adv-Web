import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('apply')
  apply(@Body() createApplicationDto: CreateApplicationDto, @Request() req) {
    return this.applicationsService.apply(createApplicationDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-applications')
  findByCandidate(@Request() req) {
    return this.applicationsService.findByCandidate(req.user.id);
  }
}