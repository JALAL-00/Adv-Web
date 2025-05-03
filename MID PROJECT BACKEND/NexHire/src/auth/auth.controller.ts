import { Controller, Post, Body, HttpCode, HttpStatus, Delete, UseGuards, Req, SetMetadata, BadRequestException, Request } from '@nestjs/common'; 
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RoleGuard } from './guards/role.guard';
import { UserRole } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async logout(@Request() req) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      throw new BadRequestException('No token provided');
    }
    await this.authService.logout(token);
  }

  @Delete('account')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @SetMetadata('role', [UserRole.RECRUITER, UserRole.CANDIDATE])
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAccount(@Req() req) {
    await this.authService.deleteAccount(req.user.id);
  }

}