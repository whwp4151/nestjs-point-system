import { IsNumber, IsPositive } from "class-validator";

export class UsePointDto {
    @IsNumber()
    userId: number;

    @IsNumber()
    @IsPositive()
    amount: number;
}

export class PointUseResponseDto {
    id: number;
    amount: number;
    balance: number;
    message: string;
}