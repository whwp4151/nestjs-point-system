import { POLICY_METADATA, PolicyCode } from "../type/point.types";

export class PointHistoryDto {
    id: number;
    point: number;
    policyCode: PolicyCode;
    policyName: string;
    createdAt: Date;

    constructor(id: number, point: number, policyCode: PolicyCode, createdAt: Date) {
        const metadata = POLICY_METADATA[policyCode];
        
        this.id = id;
        this.point = point;
        this.policyCode = policyCode;
        this.policyName = metadata.name;
        this.createdAt = createdAt;
    }
}