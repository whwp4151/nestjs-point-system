import { EarnPointDto } from "@/point/dto/earn-point.dto";
import { PrismaService } from "@/prisma/prisma.service";
import { PointPolicyInterface } from "./point-policy.interface";

export class DailyLoginPolicy implements PointPolicyInterface {
    canApply(prisma: PrismaService, dto: EarnPointDto): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    calculatePoints(dto: EarnPointDto): Promise<number> {
        throw new Error("Method not implemented.");
    }
    generateMetadata(dto: EarnPointDto): Record<string, any> {
        throw new Error("Method not implemented.");
    }

}