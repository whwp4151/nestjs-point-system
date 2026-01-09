import { POLICY_METADATA, PolicyCode } from "../type/point.types";

export class PointHistoryDto {
    id: number;
    point: number;
    policyCode: PolicyCode | null;
    policyName: string | null;
    createdAt: Date;

    constructor(id: number, point: number, createdAt: Date, policyCode: PolicyCode | null) {
        this.id = id;
        this.point = point;
        this.createdAt = createdAt;

        this.policyCode = policyCode;
        this.policyName = policyCode
        ? POLICY_METADATA[policyCode].name
        : null;
    }
}