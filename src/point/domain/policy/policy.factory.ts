import { Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { PointPolicyInterface } from "./point-policy.interface";
import { PolicyCode } from "@/point/type/point.types";
import { POLICY_REGISTRY } from "./policy.registry";

@Injectable()
export class PolicyFactory {
  constructor(private moduleRef: ModuleRef) {}

  /**
   * 정책 코드에 따라 구현체 인스턴스 반환
   */
  getPolicy(code: PolicyCode): PointPolicyInterface {
    const PolicyClass = POLICY_REGISTRY[code];
    
    if (!PolicyClass) {
      throw new Error(`지원하지 않는 정책 코드입니다: ${code}`);
    }

    // NestJS DI 컨테이너에서 인스턴스 가져오기
    return this.moduleRef.get(PolicyClass, { strict: false });
  }
}