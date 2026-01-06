import { PrismaService } from "src/prisma/prisma.service";
import { PointPolicyInterface } from "./point-policy.interface";
import { EarnPointDto } from "src/point/dto/earn-point.dto";
import { PolicyCode } from "src/point/type/point.types";

export class WelcomePolicy implements PointPolicyInterface {
  private readonly amount: number;

  constructor(amount: number = 1000) {
    this.amount = amount;
  }

  async canApply(prisma: PrismaService, dto: EarnPointDto): Promise<boolean> {
    // 이미 가입 축하 포인트를 받았는지 확인
    const existingHistory = await prisma.pointHistory.findFirst({
      where: {
        userId: dto.userId,
        policyType: PolicyCode.WELCOME,
      },
    });

    // 이미 적립 받았으면 불가
    return existingHistory === null;
  }

  async calculatePoints(dto: EarnPointDto): Promise<number> {
    return this.amount;
  }

  generateMetadata(dto: EarnPointDto): Record<string, any> {
    return {
      appliedAt: new Date().toISOString(),
      oneTimeBonus: true,
    };
  }
}