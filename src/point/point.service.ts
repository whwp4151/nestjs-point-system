import { Injectable } from '@nestjs/common';
import { EarnPointDto } from './dto/earn-point.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { PointHistoryDto } from './dto/point-history.dto';
import { PointType } from './type/point.types';

@Injectable()
export class PointService {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * 포인트 적립
     */
    async earnPoints(dto: EarnPointDto): Promise<PointHistoryDto> {
        return await this.prisma.$transaction(async (tx) => {

        // 정책 인스턴스 생성
        const policyInstance = PolicyFactory.createPolicy(
            request.policyCode,
            policy.amount,
            policy.config as any
        );

        // 정책 적용 가능 여부 확인 (PrismaService를 전달)
        const canApply = await policyInstance.canApply(this.prisma, request);
        if (!canApply) {
            throw new Error(`정책을 적용할 수 없습니다: ${policy.name}`);
        }

        // 포인트 계산
        const amount = await policyInstance.calculatePoints(request);
        if (amount <= 0) {
            throw new Error('적립 포인트는 0보다 커야 합니다.');
        }

        // 메타데이터 생성
        const metadata = policyInstance.generateMetadata(request);

        // 포인트 이력 생성
        const history = await tx.pointHistory.create({
            data: {
                userId: dto.userId,
                policyType: dto.policyCode,
                amount,
            },
        });

        return {
            id: history.id,
            type: history.type as PointType,
            amount: history.amount,
            description: history.description,
            policyName: history.policy?.name,
            createdAt: history.createdAt,
        };
        });
    }

}
