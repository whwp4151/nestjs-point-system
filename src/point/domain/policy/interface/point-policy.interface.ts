import { PointStateDto } from '@/point/dto/point-state.dto';
import { PolicyCode } from '@/point/type/point.types';
import { PrismaService } from '@/prisma/prisma.service';

export interface PointPolicyInterface {
  getPolicyCode(): PolicyCode;
  calcPoint(userId: number, prisma: PrismaService): Promise<number>;
  getPointState(userId: number, prisma: PrismaService): Promise<PointStateDto>;
}