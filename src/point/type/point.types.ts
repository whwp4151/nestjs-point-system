export enum PointType {
  EARN = 'EARN',
  USE = 'USE',
}

export enum PolicyCode {
  WELCOME = 'WELCOME',
  DAILY_LOGIN = 'DAILY_LOGIN',
  EVENT_BONUS = 'EVENT_BONUS',
}

export interface PolicyConfig {
  eventStartDate?: string;
  eventEndDate?: string;
  multiplier?: number;
}

// 내부 서비스 간 통신용
export interface PointBalance {
  userId: string;
  balance: number;
}

// 정책 실행 컨텍스트 (내부 전용)
export interface PolicyExecutionContext {
  userId: string;
  policyCode: PolicyCode;
  requestedAt: Date;
}