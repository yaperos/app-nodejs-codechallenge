import {Test, TestingModule} from '@nestjs/testing';
import {TransactionController} from './transaction.controller';
import {TransactionService} from './transaction.service';
import {PrismaService} from "../prisma/prisma.service";

describe('ConsumerController', () => {
    let controller: TransactionController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TransactionController],
            providers: [TransactionService, PrismaService, {
                provide: 'KAFKA_PRODUCER',
                useValue: {
                    send: jest.fn(),
                },
            },],
        }).compile();

        controller = module.get<TransactionController>(TransactionController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
