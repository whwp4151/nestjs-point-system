import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    console.log(process.env.DATABASE_URL);
    super({
      adapter: new PrismaPg({
        connectionString: process.env.DATABASE_URL,
        pool: {
          max: 10,
          connectionTimeoutMillis: 5000,
        },
      }),
    });
  }

  /**
   * 애플리케이션 시작 시 DB 연결
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * 애플리케이션 종료 시 DB 연결 해제
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }

  /**
   * 헬스체크용 메서드
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      return false;
    }
  }
}
