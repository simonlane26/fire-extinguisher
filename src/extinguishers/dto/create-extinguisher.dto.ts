import { IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateExtinguisherDto {
  @IsString() location: string;
  @IsString() building: string;
  @IsString() type: string;

  @IsOptional() @IsString() externalId?: string;
  @IsOptional() @IsString() floor?: string;
  @IsOptional() @IsString() capacity?: string;
  @IsOptional() @IsString() manufacturer?: string;
  @IsOptional() @IsString() model?: string;
  @IsOptional() @IsString() serialNumber?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() condition?: string;
  @IsOptional() @IsString() serviceType?: string;
  @IsOptional() @IsString() inspector?: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsDateString() installDate?: string;
  @IsOptional() @IsDateString() expiryDate?: string;
  @IsOptional() @IsDateString() lastInspection?: string;
  @IsOptional() @IsDateString() nextInspection?: string;
  @IsOptional() @IsDateString() lastMaintenance?: string;
  @IsOptional() @IsDateString() nextMaintenance?: string;
}

