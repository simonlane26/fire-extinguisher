// src/quotes/dto/update-quote.dto.ts
import { IsString, IsOptional, IsDateString, IsNumber, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateQuoteLineDto } from './create-quote.dto';

export class UpdateQuoteDto {
  @IsOptional()
  @IsEnum(['draft', 'sent', 'accepted', 'rejected', 'expired'])
  status?: string;

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
