import { PrismaService } from "@/prisma/prisma.service";
import { Prisma } from "generated/prisma/client";

export type PrismaTx = PrismaService | Prisma.TransactionClient;

export enum PointType {
  EARN = 'EARN',
  USE = 'USE',
}

export enum PointState {
  NONE = 'NONE',                                // 미진행
  CONDITION_COMPLETED = 'CONDITION_COMPLETED',  // 포인트 지급 조건 달성
  POINT_PAID = 'POINT_PAID',                    // 포인트 지급한 상태
}

export enum PolicyCode {
  WELCOME = 'WELCOME',
  DAILY_LOGIN = 'DAILY_LOGIN',
}

// 정책 메타데이터
export interface PolicyMetadata {
  name: string;
  description: string;
  amount: number;
}

// 정책 코드별 메타데이터
export const POLICY_METADATA: Record<PolicyCode, PolicyMetadata> = {
  [PolicyCode.WELCOME]: {
    name: '가입 축하 포인트',
    description: '회원 가입 시 1회만 적립',
    amount: 1000,
  },
  [PolicyCode.DAILY_LOGIN]: {
    name: '일일 로그인 포인트',
    description: '하루 1회 적립 가능',
    amount: 100,
  },
};

// 헬퍼 함수
export function getPolicyMetadata(code: PolicyCode): PolicyMetadata {
  return POLICY_METADATA[code];
}
