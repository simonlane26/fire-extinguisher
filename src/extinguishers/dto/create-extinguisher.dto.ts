import { IsOptional, IsString, IsDateString, MaxLength } from 'class-validator';

export class CreateExtinguisherDto {
  @IsString() @MaxLength(255) location: string;
  @IsString() @MaxLength(255) building: string;
  @IsString() @MaxLength(100) type: string;

  @IsOptional() @IsString() @MaxLength(100) externalId?: string;
  @IsOptional() @IsString() @MaxLength(100) siteId?: string;
  @IsOptional() @IsString() @MaxLength(50) floor?: string;
  @IsOptional() @IsString() @MaxLength(50) capacity?: string;
  @IsOptional() @IsString() @MaxLength(50) weight?: string;
  @IsOptional() @IsString() @MaxLength(100) manufacturer?: string;
  @IsOptional() @IsString() @MaxLength(100) model?: string;
  @IsOptional() @IsString() @MaxLength(100) serialNumber?: string;
  @IsOptional() @IsString() @MaxLength(50) status?: string;
  @IsOptional() @IsString() @MaxLength(50) condition?: string;
  @IsOptional() @IsString() @MaxLength(100) serviceType?: string;
  @IsOptional() @IsString() @MaxLength(100) inspector?: string;
  @IsOptional() @IsString() @MaxLength(2000) notes?: string;
  @IsOptional() @IsDateString() installDate?: string;
  @IsOptional() @IsDateString() expiryDate?: string;
  @IsOptional() @IsDateString() lastInspection?: string;
  @IsOptional() @IsDateString() nextInspection?: string;
  @IsOptional() @IsDateString() lastMaintenance?: string;
  @IsOptional() @IsDateString() nextMaintenance?: string;
}

