import { IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateExtinguisherDto {
  @IsString() location: string;
  @IsString() building: string;
  @IsString() type: string;

  @IsOptional() @IsString() floor?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() condition?: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsDateString() installDate?: string;
  @IsOptional() @IsDateString() expiryDate?: string;
}

