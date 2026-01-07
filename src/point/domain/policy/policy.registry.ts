import { PolicyCode } from "@/point/type/point.types";
import { PointPolicyInterface } from "./point-policy.interface";
import { Type } from "@nestjs/common";
import { WelcomePolicy } from "./welcome.policy";
import { DailyLoginPolicy } from "./daily-login.policy";

// 정책 코드와 구현체 매핑
export const POLICY_REGISTRY: Record<PolicyCode, Type<PointPolicyInterface>> = {
  [PolicyCode.WELCOME]: WelcomePolicy,
  [PolicyCode.DAILY_LOGIN]: DailyLoginPolicy,
};