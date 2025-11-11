import { PartialType } from '@nestjs/mapped-types';
import { CreateExtinguisherDto } from './create-extinguisher.dto';
export class UpdateExtinguisherDto extends PartialType(CreateExtinguisherDto) {}
