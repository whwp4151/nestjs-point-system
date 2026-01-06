import { IsEnum, IsOptional, IsNumber, Min } from 'class-validator';
import { PolicyCode } from '../type/point.types';

export class EarnPointDto {
  @IsNumber()
  userId: number;

  @IsEnum(PolicyCode)
  policyCode: PolicyCode;

  @IsOptional()
  @IsNumber()
  @Min(0)
  baseAmount?: number;
}