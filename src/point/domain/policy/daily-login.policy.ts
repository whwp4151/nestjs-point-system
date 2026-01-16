import { PointPolicyInterface } from "./interface/point-policy.interface";
import { PointStateDto } from "@/point/dto/point-state.dto";
import { Injectable } from "@nestjs/common";
import { Policy } from "./policy.decorator";
import { PointState, POLICY_METADATA, PolicyCode, PrismaTx } from "@/point/type/point.types";

@Injectable()
@Policy()
export class DailyLoginPolicy implements PointPolicyInterface {

    private readonly policyCode: PolicyCode = 'DAILY_LOGIN';
    private readonly metadata = POLICY_METADATA[this.policyCode];

    getPolicyCode(): PolicyCode {
        return this.policyCode;
    }

    async calcPoint(userId: number, prisma: PrismaTx): Promise<number> {
        // 제한 조건을 만족했느냐?
        if (await this.checkLimitCond(userId, prisma)) {
            return this.metadata.amount;
        }

        return 0;
    }

    async getPointState(userId: number, prisma: PrismaTx): Promise<PointStateDto> {
        const state = await this.checkLimitCond(userId, prisma) ? 
            PointState.CONDITION_COMPLETED : 
            PointState.POINT_PAID;
    
        return {
            point: this.metadata.amount, 
            policyCode: this.policyCode, 
            state: state
        };
    }

    // 제한 조건
    private async checkLimitCond(userId: number, prisma: PrismaTx): Promise<boolean> {
        // 오늘 시작 시간 (00:00:00)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 내일 시작 시간 (다음날 00:00:00)
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // 오늘 날짜 범위 내에서 로그인 포인트 조회
        const existingHistory = await prisma.pointHistory.findFirst({
            where: {
                userId: userId,
                policyType: this.policyCode,
                createdAt: {
                    gte: today,
                    lt: tomorrow,
                },
            },
        });

        return existingHistory === null;
    }

}