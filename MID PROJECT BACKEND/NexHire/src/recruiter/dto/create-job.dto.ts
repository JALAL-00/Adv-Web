import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateJobDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  location: string;

  @IsString()
  @IsOptional()
  salary?: string;

  @IsArray()
  @IsOptional()
  skills?: string[];

  @IsString()
  experience: string;
}