import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { EarnPointDto } from './dto/earn-point.dto';
import { PointService } from './point.service';
import { PointHistoryDto } from './dto/point-history.dto';
import { PointBalanceDto } from './dto/point-balance.dto';
import { PointUseResponseDto, UsePointDto } from './dto/use-point.dto';

@Controller('point')
export class PointController {
    constructor(private readonly pointService: PointService) {}

    @Post('earn')
    async earnPoints(
        @Body() dto: EarnPointDto
    ): Promise<PointHistoryDto> {
        return this.pointService.earnPoints(dto);
    }

    @Post('use')
    async usePoints(@Body() dto: UsePointDto): Promise<PointUseResponseDto> {
        return this.pointService.usePoints(dto);
    }

    @Get('balance/:userId')
    async getBalance(
        @Param('userId', ParseIntPipe) userId: number
    ): Promise<PointBalanceDto> {
        return this.pointService.getBalance(userId);
    }

    @Get('history/:userId')
    async getPointHistory(
        @Param('userId', ParseIntPipe) userId: number
    ): Promise<PointHistoryDto[]> {
        return this.pointService.getPointHistory(userId);
    }

}
