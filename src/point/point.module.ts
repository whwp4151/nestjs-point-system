import { Module } from '@nestjs/common';
import { PointService } from './point.service';
import { PointController } from './point.controller';
import { PolicyFactory } from './domain/policy/policy.factory';
import { PrismaModule } from '@/prisma/prisma.module';
import { WelcomePolicy } from './domain/policy/welcome.policy';
import { DailyLoginPolicy } from './domain/policy/daily-login.policy';
import { DiscoveryModule } from '@nestjs/core';

@Module({
  imports: [PrismaModule, DiscoveryModule],
  providers: [
    PointService,
    PolicyFactory,
    WelcomePolicy,
    DailyLoginPolicy,
  ],
  controllers: [PointController]
})
export class PointModule {}
