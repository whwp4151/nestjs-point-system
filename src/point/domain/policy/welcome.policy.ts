import { PointPolicyInterface } from "./interface/point-policy.interface";
import { PointState, POLICY_METADATA, PolicyCode, PrismaTx } from "@/point/type/point.types";
import { PointStateDto } from "@/point/dto/point-state.dto";
import { Injectable } from "@nestjs/common";
import { Policy } from "./policy.decorator";

@Injectable()
@Policy()
export class WelcomePolicy implements PointPolicyInterface {

  private readonly policyCode: PolicyCode = 'WELCOME';
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
    // 이미 가입 축하 포인트를 받았는지 확인
    const existingHistory = await prisma.pointHistory.findFirst({
      where: {
        userId: userId,
        policyType: this.policyCode,
      },
    });

    // 이미 적립 받았으면 불가
    return existingHistory === null;
  }

}