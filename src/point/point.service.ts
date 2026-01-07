import { Injectable } from '@nestjs/common';
import { EarnPointDto } from './dto/earn-point.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { PointHistoryDto } from './dto/point-history.dto';
import { PointType, PolicyCode } from './type/point.types';
import { PolicyFactory } from './domain/policy/policy.factory';

@Injectable()
export class PointService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly policyFactory: PolicyFactory,
    ) {}

    /**
     * 포인트 적립
     */
    async earnPoints(dto: EarnPointDto): Promise<PointHistoryDto> {
        return await this.prisma.$transaction(async (tx) => {

            const policy = this.policyFactory.getPolicy(dto.policyCode);

            const point = await policy.calcPoint(dto.userId, this.prisma);
            if (point <= 0) {
                throw new Error('적립 포인트는 0보다 커야 합니다.');
            }

            // 포인트 이력 생성
            const history = await tx.pointHistory.create({
                data: {
                    userId: dto.userId,
                    policyType: dto.policyCode,
                    amount: point,
                },
            });

            return new PointHistoryDto(
                history.id,
                history.amount,
                history.policyType as PolicyCode,
                history.createdAt,
            );
        });
    }

}
