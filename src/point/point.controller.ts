import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EarnPointDto } from './dto/earn-point.dto';
import { PointService } from './point.service';
import { PointHistoryDto } from './dto/point-history.dto';

@Controller('point')
export class PointController {
    constructor(private readonly pointService: PointService) {}

    @Post('earn')
    async earnPoints(
        @Body() dto: EarnPointDto
    ): Promise<PointHistoryDto> {
        return this.pointService.earnPoints(dto);
    }

}
