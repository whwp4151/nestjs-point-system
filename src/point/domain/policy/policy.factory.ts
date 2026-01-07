import { Injectable, OnModuleInit } from "@nestjs/common";
import { DiscoveryService, ModuleRef, Reflector } from "@nestjs/core";
import { PointPolicyInterface } from "./interface/point-policy.interface";
import { PolicyCode } from "@/point/type/point.types";
import { InstanceWrapper } from "@nestjs/core/injector/instance-wrapper";
import { POLICY_METADATA_KEY } from "./policy.decorator";

@Injectable()
export class PolicyFactory implements OnModuleInit {
  private policyMap = new Map<PolicyCode, PointPolicyInterface>();

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
  ) {}

  async onModuleInit() {
    // ✅ 모든 Provider 중에서 @Policy() 데코레이터가 붙은 것만 자동 수집
    const providers = this.discoveryService.getProviders();
    
    providers
      .filter((wrapper: InstanceWrapper) => {
        const { instance } = wrapper;
        if (!instance || typeof instance !== 'object') return false;

        // @Policy() 데코레이터 체크
        return this.reflector.get(POLICY_METADATA_KEY, instance.constructor);
      })
      .forEach((wrapper: InstanceWrapper) => {
        const policy = wrapper.instance as PointPolicyInterface;
        const policyCode = policy.getPolicyCode();
        
        this.policyMap.set(policyCode, policy);
      });
  }

  /**
   * 정책 코드에 따라 구현체 인스턴스 반환
   */
  getPolicy(code: PolicyCode): PointPolicyInterface {
    const policy = this.policyMap.get(code);
    
    if (!policy) {
      throw new Error(`지원하지 않는 정책 코드입니다: ${code}`);
    }
    
    return policy;
  }
}