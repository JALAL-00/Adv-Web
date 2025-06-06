import { IsString, IsOptional } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @IsOptional()
  coverLetter?: string;
  
  @IsString()
  @IsOptional()
  jobId: number;
}