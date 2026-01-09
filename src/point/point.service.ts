import { Injectable } from '@nestjs/common';
import { EarnPointDto } from './dto/earn-point.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { PointHistoryDto } from './dto/point-history.dto';
import { PointType, PolicyCode, PrismaTx } from './type/point.types';
import { PolicyFactory } from './domain/policy/policy.factory';
import { PointBalanceDto } from './dto/point-balance.dto';
import { PointUseResponseDto, UsePointDto } from './dto/use-point.dto';

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

            const point = await policy.calcPoint(dto.userId, tx);
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
                history.createdAt,
                history.policyType as PolicyCode | null,
            );
        });
    }

    async usePoints(dto: UsePointDto): Promise<PointUseResponseDto> {
        return await this.prisma.$transaction(async (tx) => {
            const currentBalance = await this.getBalanceInTransaction(tx, dto.userId);

            if (currentBalance < dto.amount) {
                throw new Error(
                    `포인트가 부족합니다. (현재 잔액: ${currentBalance}, 요청 금액: ${dto.amount})`
                );
            }

            if (dto.amount <= 0) {
                throw new Error('사용 포인트는 0보다 커야 합니다.');
            }

            const history = await tx.pointHistory.create({
                data: {
                    userId: dto.userId,
                    amount: -dto.amount,
                },
            });

            const newBalance = currentBalance - dto.amount;

            return {
                id: history.id,
                amount: dto.amount,
                balance: newBalance,
                message: `${dto.amount} 포인트가 사용되었습니다.`,
            };
        });
    }

    async getBalance(userId: number): Promise<PointBalanceDto> {
        return await this.prisma.$transaction(async (tx) => {
            const currentBalance = await this.getBalanceInTransaction(tx, userId);

            return {
                userId,
                balance: currentBalance,
            };
        });
    }

    async getPointHistory(userId: number): Promise<PointHistoryDto[]> {
        const histories = await this.prisma.pointHistory.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        return histories.map((history) => (
            new PointHistoryDto(
                history.id,
                history.amount,
                history.createdAt,
                history.policyType as PolicyCode | null,
            )
        ));
    }

    /**
   * 트랜잭션 내에서 잔액 조회
   */
    private async getBalanceInTransaction(
        tx: PrismaTx,
        userId: number
    ): Promise<number> {
        const result = await tx.pointHistory.aggregate({
            where: { userId },
            _sum: { amount: true },
        });

        return result._sum.amount || 0;
    }

}
