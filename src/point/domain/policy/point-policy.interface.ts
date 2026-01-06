import { EarnPointDto } from 'src/point/dto/earn-point.dto';
import { PrismaService } from '../../../prisma/prisma.service';


export interface PointPolicyInterface {
  /**
   * 정책 적용 가능 여부 검증
   */
  canApply(prisma: PrismaService, dto: EarnPointDto): Promise<boolean>;

  /**
   * 적립 포인트 계산
   */
  calculatePoints(dto: EarnPointDto): Promise<number>;

  /**
   * 정책 실행 후 메타데이터 생성
   */
  generateMetadata(dto: EarnPointDto): Record<string, any>;
}