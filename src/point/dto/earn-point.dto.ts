import { IsIn, IsNumber } from 'class-validator';
import { POLICY_CODES, PolicyCode } from '../type/point.types';

export class EarnPointDto {
  @IsNumber()
  userId: number;

  @IsIn([...POLICY_CODES])
  policyCode: PolicyCode;
}