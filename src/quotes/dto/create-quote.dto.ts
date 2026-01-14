// src/quotes/dto/create-quote.dto.ts
import { IsString, IsOptional, IsDateString, IsNumber, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateQuoteLineDto {
  @IsOptional()
  @IsString()
  inventoryItemId?: string;

  @IsString()
  description: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitPrice: number;

  @IsBoolean()
  @IsOptional()
  isLabour?: boolean;
}

export class CreateQuoteDto {
  @IsString()
  extinguisherId: string;

  @IsOptional()
  @IsString()
  inspectionId?: string;

  @IsOptional()
  @IsDateString()
  validUntil?: string;

  @IsOptional()
  @IsNumber()
  vatRate?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  termsConditions?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuoteLineDto)
  @IsOptional()
  lines?: CreateQuoteLineDto[];
}
