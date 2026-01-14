import { Test, TestingModule } from '@nestjs/testing';
import { PointService } from './point.service';
import { CustomException } from '@/common/exception/custom.exception';
import { PolicyFactory } from './domain/policy/policy.factory';
import { EarnPointDto } from './dto/earn-point.dto';
import { UsePointDto } from './dto/use-point.dto';
import { PrismaService } from '@/prisma/prisma.service';

describe('PointService', () => {
    let service: PointService;
    let prisma: PrismaService;
    let policyFactory: PolicyFactory;

    const txMock = {
        pointHistory: {
            create: jest.fn(),
            aggregate: jest.fn(),
            findMany: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PointService,
                {
                    provide: PrismaService,
                    useValue: {
                        $transaction: jest.fn((cb) => cb(txMock)),
                        pointHistory: {
                            aggregate: jest.fn(),
                            findMany: jest.fn(),
                        },
                    },
                },
                {
                    provide: PolicyFactory,
                    useValue: {
                        getPolicy: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get(PointService);
        prisma = module.get(PrismaService);
        policyFactory = module.get(PolicyFactory);

        jest.clearAllMocks();
    });

    describe('earnPoints', () => {
        it('정상적으로 포인트를 적립한다', async () => {
            const dto: EarnPointDto = {
                userId: 1,
                policyCode: 'DAILY_LOGIN',
            };

            const mockPolicy = {
                calcPoint: jest.fn().mockResolvedValue(100),
            };

            policyFactory.getPolicy = jest.fn().mockReturnValue(mockPolicy);

            txMock.pointHistory.create.mockResolvedValue({
                id: 1,
                userId: 1,
                amount: 100,
                policyType: 'DAILY_LOGIN',
                createdAt: new Date(),
            });

            const result = await service.earnPoints(dto);

            expect(policyFactory.getPolicy).toHaveBeenCalledWith('DAILY_LOGIN');
            expect(mockPolicy.calcPoint).toHaveBeenCalled();
            expect(txMock.pointHistory.create).toHaveBeenCalledWith({
                data: {
                    userId: 1,
                    policyType: 'DAILY_LOGIN',
                    amount: 100,
                },
            });

            expect(result.point).toBe(100);
        });

        it('적립 포인트가 0 이하이면 예외를 던진다', async () => {
            const dto: EarnPointDto = {
                userId: 1,
                policyCode: 'DAILY_LOGIN',
            };

            policyFactory.getPolicy = jest.fn().mockReturnValue({
                calcPoint: jest.fn().mockResolvedValue(0),
            });

            await expect(service.earnPoints(dto)).rejects.toBeInstanceOf(CustomException);
        });
    });

    describe('usePoints', () => {
        it('정상적으로 포인트를 사용한다', async () => {
            const dto: UsePointDto = {
                userId: 1,
                amount: 50,
            };

            txMock.pointHistory.aggregate.mockResolvedValue({
                _sum: { amount: 100 },
            });

            txMock.pointHistory.create.mockResolvedValue({
                id: 10,
                userId: 1,
                amount: -50,
                createdAt: new Date(),
            });

            const result = await service.usePoints(dto);

            expect(txMock.pointHistory.aggregate).toHaveBeenCalled();
            expect(txMock.pointHistory.create).toHaveBeenCalledWith({
                data: {
                    userId: 1,
                    amount: -50,
                },
            });

            expect(result.balance).toBe(50);
        });

        it('잔액이 부족하면 예외를 던진다', async () => {
            const dto: UsePointDto = {
                userId: 1,
                amount: 100,
            };

            txMock.pointHistory.aggregate.mockResolvedValue({
                _sum: { amount: 30 },
            });

            await expect(service.usePoints(dto)).rejects.toBeInstanceOf(CustomException);
        });

        it('사용 포인트가 0 이하이면 예외를 던진다', async () => {
            const dto: UsePointDto = {
                userId: 1,
                amount: 0,
            };

            txMock.pointHistory.aggregate.mockResolvedValue({
                _sum: { amount: 100 },
            });

            await expect(service.usePoints(dto)).rejects.toBeInstanceOf(CustomException);
        });
    });

    describe('getBalance', () => {
        it('현재 잔액을 조회한다', async () => {
            prisma.pointHistory.aggregate = jest.fn().mockResolvedValue({
                _sum: { amount: 200 },
            });

            const result = await service.getBalance(1);

            expect(result.balance).toBe(200);
        });
    });
});
