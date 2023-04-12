import {Test, TestingModule} from '@nestjs/testing';
import {TransactionService} from './transaction.service';
import {PrismaService} from "../prisma/prisma.service";

const fakeTransactions = [
    {
        "id": 1,
        "value": 999,
        "accountExternalIdDebit": "guid",
        "accountExternalIdCredit": "guid1",
        "statusId": 1,
        "transferTypeId": 2,
        "createdAt": "2023-04-12T20:49:59.798Z",
        "updatedAt": "2023-04-12T20:49:59.798Z",
        "type": {
            "id": 2,
            "name": "Credit",
            "createdAt": "2023-04-12T14:59:33.335Z",
            "updatedAt": "2023-04-12T14:59:33.335Z"
        },
        "status": {
            "id": 1,
            "name": "Pending",
            "createdAt": "2023-04-12T14:59:33.320Z",
            "updatedAt": "2023-04-12T14:59:33.320Z"
        }
    }, {
        "id": 2,
        "value": 1000,
        "accountExternalIdDebit": "guid",
        "accountExternalIdCredit": "guid1",
        "statusId": 1,
        "transferTypeId": 2,
        "createdAt": "2023-04-12T20:49:59.798Z",
        "updatedAt": "2023-04-12T20:49:59.798Z",
        "type": {
            "id": 2,
            "name": "Credit",
            "createdAt": "2023-04-12T14:59:33.335Z",
            "updatedAt": "2023-04-12T14:59:33.335Z"
        },
        "status": {
            "id": 1,
            "name": "Pending",
            "createdAt": "2023-04-12T14:59:33.320Z",
            "updatedAt": "2023-04-12T14:59:33.320Z"
        }
    },
    {
        "id": 3,
        "value": 700,
        "accountExternalIdDebit": "guid",
        "accountExternalIdCredit": "guid1",
        "statusId": 1,
        "transferTypeId": 2,
        "createdAt": "2023-04-12T20:49:59.798Z",
        "updatedAt": "2023-04-12T20:49:59.798Z",
        "type": {
            "id": 2,
            "name": "Credit",
            "createdAt": "2023-04-12T14:59:33.335Z",
            "updatedAt": "2023-04-12T14:59:33.335Z"
        },
        "status": {
            "id": 1,
            "name": "Pending",
            "createdAt": "2023-04-12T14:59:33.320Z",
            "updatedAt": "2023-04-12T14:59:33.320Z"
        }
    }
];

const prismaMock = {
    transaction: {
        create: jest.fn().mockReturnValue(fakeTransactions[0]),
        findMany: jest.fn().mockResolvedValue(fakeTransactions),
        findUnique: jest.fn().mockResolvedValue(fakeTransactions[0])
    },
};

describe('TransactionService', () => {
    let service: TransactionService;
    let prisma: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TransactionService,
                {
                    provide: 'KAFKA_PRODUCER',
                    useValue: {
                        send: jest.fn(),
                    },
                },
                {provide: PrismaService, useValue: prismaMock},
            ],
        }).compile();

        service = module.get<TransactionService>(TransactionService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findAll', () => {
        it(`should return an array of transactions`, async () => {
            const response = await service.findAll();
            expect(response).toEqual(fakeTransactions);
            expect(prisma.transaction.findMany).toHaveBeenCalledTimes(1);
        });
    });

    describe('findOne', () => {
        it(`should return a single transaction`, async () => {
            const response = await service.findOne(1);

            expect(response).toEqual(fakeTransactions[0]);
            expect(prisma.transaction.findUnique).toHaveBeenCalledTimes(1);
        });

        it(`should return nothing when transaction is not found`, async () => {
            jest.spyOn(prisma.transaction, 'findUnique').mockResolvedValue(undefined);

            const response = await service.findOne(99);

            expect(response).toBeUndefined();
            expect(prisma.transaction.findUnique).toHaveBeenCalledTimes(1);
        });
    });

    describe('create', () => {
        it(`should create a new transaction`, async () => {
            const response = await service.create(fakeTransactions[0]);

            expect(response).toBe(fakeTransactions[0]);
            expect(prisma.transaction.create).toHaveBeenCalledTimes(1);

        });
    });
});
