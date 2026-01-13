import { CustomException } from '@/common/exception/custom.exception';
import { ErrorCode } from '@/common/exception/error-code';
import { PrismaService } from '@/prisma/prisma.service';
import { Controller, Get, HttpStatus } from '@nestjs/common';

@Controller('health')
export class HealthController {
    constructor(private readonly prisma: PrismaService) {}

    @Get()
    async check() {
      const dbHealthy = await this.prisma.healthCheck();

      return {
        status: dbHealthy ? 'ok' : 'error',
        timestamp: new Date().toISOString(),
        database: dbHealthy ? 'connected' : 'disconnected',
      };
    }

    @Get('db')
    async checkDatabase() {
      const isHealthy = await this.prisma.healthCheck();

      if (!isHealthy) {
        throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, 'Database connection failed.', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return {
        status: 'ok',
        message: 'Database is connected',
        timestamp: new Date().toISOString(),
      };
    }
}
