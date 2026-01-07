import { PointPolicyInterface } from "./interface/point-policy.interface";
import { PointStateDto } from "@/point/dto/point-state.dto";
import { Injectable } from "@nestjs/common";
import { Policy } from "./policy.decorator";
import { PolicyCode, PrismaTx } from "@/point/type/point.types";

@Injectable()
@Policy()
export class DailyLoginPolicy implements PointPolicyInterface {

    getPolicyCode(): PolicyCode {
        return PolicyCode.DAILY_LOGIN;
    }

    async calcPoint(userId: number, prisma: PrismaTx): Promise<number> {
        throw new Error("Method not implemented.");
    }

    async getPointState(userId: number, prisma: PrismaTx): Promise<PointStateDto> {
        throw new Error("Method not implemented.");
    }

}