import { IsArray, IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateProfileDto {
  @IsArray()
  @IsOptional()
  skills?: string[];

  @IsString()
  @IsOptional()
  experience?: string;

  @IsArray()
  @IsOptional()
  education?: { institution: string; degree: string; year: number }[];

  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;
}