import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ClientProxy } from "@nestjs/microservices";

import { TransactionController } from "./transaction.controller";
import { TransactionService } from "./transaction.service";
import { TransactionEntity } from "./entities/transaction.entity";
import { TransactionRepository } from "./repository/transaction.repository";

describe("TransactionController", () => {
  let controller: TransactionController;
  let service: TransactionService;
  let repository: Repository<TransactionEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        TransactionRepository,
        {
          provide: getRepositoryToken(TransactionEntity),
          useClass: Repository,
        },
        {
          provide: "YAPE",
          useValue: ClientProxy,
        },
      ],
      controllers: [TransactionController],
    }).compile();

    repository = module.get<Repository<TransactionEntity>>(
      getRepositoryToken(TransactionEntity)
    );
    service = module.get<TransactionService>(TransactionService);
    controller = module.get<TransactionController>(TransactionController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
