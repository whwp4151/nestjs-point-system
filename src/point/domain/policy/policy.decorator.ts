import { SetMetadata } from '@nestjs/common';

// ✅ 정책임을 표시하는 커스텀 데코레이터
export const POLICY_METADATA_KEY = 'isPolicy';
export const Policy = () => SetMetadata(POLICY_METADATA_KEY, true);