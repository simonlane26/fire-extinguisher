import { IsOptional, IsString, IsNumber, IsArray, IsObject, IsEnum, Min, Max } from 'class-validator';

export class GenerateQrDto {
  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsObject()
  extinguisherData?: {
    id?: string;
    location?: string;
    building?: string;
    floor?: string;
    type?: string;
    capacity?: string;
    manufacturer?: string;
    model?: string;
    serialNumber?: string;
    installDate?: string;
    expiryDate?: string;
    status?: string;
    condition?: string;
    serviceType?: string;
    inspector?: string;
    notes?: string;
    lastInspection?: string;
    nextInspection?: string;
    lastMaintenance?: string;
    nextMaintenance?: string;
  };

  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(2000)
  size?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  scale?: number;

  @IsOptional()
  @IsEnum(['L', 'M', 'Q', 'H'])
  errorCorrection?: 'L' | 'M' | 'Q' | 'H';

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(20)
  margin?: number;

  @IsOptional()
  @IsString()
  foregroundColor?: string;

  @IsOptional()
  @IsString()
  backgroundColor?: string;
}

export class GenerateBulkQrDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  extinguisherIds?: string[];

  @IsOptional()
  @IsString()
  prefix?: string;

  @IsOptional()
  @IsNumber()
  startNumber?: number;

  @IsOptional()
  @IsNumber()
  endNumber?: number;

  @IsOptional()
  @IsString()
  suffix?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  padding?: number;

  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(2000)
  size?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  scale?: number;

  @IsOptional()
  @IsEnum(['L', 'M', 'Q', 'H'])
  errorCorrection?: 'L' | 'M' | 'Q' | 'H';

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(20)
  margin?: number;

  @IsOptional()
  @IsString()
  foregroundColor?: string;

  @IsOptional()
  @IsString()
  backgroundColor?: string;
}
