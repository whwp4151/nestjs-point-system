import { PrismaService } from '@/prisma/prisma.service';
import { Controller, Get } from '@nestjs/common';

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
      throw new Error('Database connection failed');
    }

    return {
      status: 'ok',
      message: 'Database is connected',
      timestamp: new Date().toISOString(),
    };
  }
}
