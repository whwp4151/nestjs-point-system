import { PointStateDto } from '@/point/dto/point-state.dto';
import { PolicyCode, PrismaTx } from '@/point/type/point.types';

export interface PointPolicyInterface {
  getPolicyCode(): PolicyCode;
  calcPoint(userId: number, prisma: PrismaTx): Promise<number>;
  getPointState(userId: number, prisma: PrismaTx): Promise<PointStateDto>;
}