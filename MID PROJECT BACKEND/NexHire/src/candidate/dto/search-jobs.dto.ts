import { IsString, IsArray, IsOptional } from 'class-validator';

export class SearchJobsDto {
  @IsString()
  @IsOptional()
  location?: string;

  @IsArray()
  @IsOptional()
  skills?: string[];

  @IsString()
  @IsOptional()
  salary?: string;
}