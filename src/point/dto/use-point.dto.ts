
export class UsePointDto {
    userId: number;
    amount: number;
}

export class PointUseResponseDto {
    id: number;
    amount: number;
    balance: number;
    message: string;
}