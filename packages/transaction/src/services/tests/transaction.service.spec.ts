import { Test } from "@nestjs/testing";
import { TransactionService } from "../transaction.service";
import { firstValueFrom, lastValueFrom, of } from "rxjs";
import {
  MOCK_TRANSACTION_INPUT,
  MOCK_TRANSACTION_ORM_RESPONSE,
  MOCK_TRANSACTION_RESULT,
} from "./mock";
import { CreateTransactionEmitter } from "../../emitter/create-transaction.emitter";
import { TransactionPayload } from "../../handlers/payload/transaction.payload";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { transactionEntityProviders } from "../../providers";
import { FindOneOptions, Repository } from "typeorm/";
import { Transaction } from "../../entities/transaction.entity";
import { TransactionNotFoundException } from "../../configuration/filters/exceptions/transaction-not-found.exception";
import { CreateTransactionInput } from "../../objects/inputs/create-transaction.input";
import { TransactionType } from "../../enums/transaction-type.enum";
import { Status } from "../../enums/status.enum";
import { DatabaseModule } from "../../configuration/database/database.module";
import config from "../../configuration/envs/config";
import { HttpStatus } from "@nestjs/common";

describe("transaction service testing", () => {
  let transactionService: TransactionService;
  let transactionRepository: Repository<Transaction>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TransactionService,
        CreateTransactionEmitter,
        ...transactionEntityProviders,
      ],
      imports: [
        DatabaseModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [config],
        }),
        ClientsModule.registerAsync([
          {
            name: "ANTI_FRAUD_SERVICE",
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
              return {
                transport: Transport.KAFKA,
                options: {
                  client: {
                    clientId: "dummyClientId",
                    brokers: [configService.get("kafka.broker")],
                  },
                  consumer: {
                    groupId: "dummyGroupId",
                  },
                },
              };
            },
            inject: [ConfigService],
          },
        ]),
      ],
    })

      .overrideProvider("ANTI_FRAUD_SERVICE")
      .useValue({
        emit: (topic: string, payload: string) => {
          return of("dummyEmit");
        },
      })
      .overrideProvider(CreateTransactionEmitter)
      .useValue({
        createTransactionEmitter: (payload: TransactionPayload) => {
          return of("dummy ack");
        },
      })
      .overrideProvider("TRANSACTION_REPOSITORY")
      .useValue({
        findOne: ({ where }: FindOneOptions<Transaction>) => {
          if (where["id"] === "MOCK_TRANSACTION_ID") {
            return of(MOCK_TRANSACTION_ORM_RESPONSE);
          } else if (where["id"] === "BAD_TRANSACTION_ID") {
            throw new Error("BAD_TRANSACTION_ERROR");
          } else {
            return of(null);
          }
        },
        save: ({
          accountExternalIdCredit,
          accountExternalIdDebit,
          value,
          transferTypeId,
        }: CreateTransactionInput) => {
          return {
            accountExternalIdCredit,
            accountExternalIdDebit,
            value,
            type:
              transferTypeId === 1
                ? TransactionType.CREDIT
                : TransactionType.DEBIT,
            status: Status.PENDING,
          };
        },
      })
      .compile();

    transactionService = moduleRef.get<TransactionService>(TransactionService);

    transactionRepository = moduleRef.get<Repository<Transaction>>(
      "TRANSACTION_REPOSITORY"
    );
  });

  describe("findById method", () => {
    it("should return a transaction object", async () => {
      const response = await firstValueFrom(
        transactionService.findById("MOCK_TRANSACTION_ID")
      );

      expect(MOCK_TRANSACTION_RESULT).toStrictEqual(response);
    });

    it("should throw an NotFoundException", async () => {
      try {
        await firstValueFrom(
          transactionService.findById("NOT_EXISTING_TRANSACTION_ID")
        );
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.response).toBeDefined();
        expect(error instanceof TransactionNotFoundException).toBe(true);
      }
    });
  });
  describe("save method", () => {
    it("should throw an OrmException", async () => {
      jest
        .spyOn(transactionRepository, "save")
        .mockRejectedValueOnce(new Error("Some error stuff"));

      try {
        await lastValueFrom(transactionService.save(MOCK_TRANSACTION_INPUT));
      } catch (error) {
        expect(error.response.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);

        expect(error).toBeDefined();
      }
    });
    it("should save an transaction entity", async () => {
      jest
        .spyOn(transactionRepository, "save")
        .mockResolvedValueOnce(Promise.resolve(MOCK_TRANSACTION_ORM_RESPONSE));

      const response = await lastValueFrom(
        transactionService.save(MOCK_TRANSACTION_INPUT)
      );

      expect(response).toStrictEqual(MOCK_TRANSACTION_RESULT);
    });
  });
  describe("update method", () => {
    it("should update the status to APPROVED and return it throught service", async () => {
      jest.spyOn(transactionRepository, "save").mockResolvedValueOnce(
        Promise.resolve({
          ...MOCK_TRANSACTION_ORM_RESPONSE,
          status: Status.APPROVED,
        })
      );

      const response = await lastValueFrom(
        transactionService.update("MOCK_TRANSACTION_ID", Status.APPROVED)
      );

      expect(response.status).toEqual(Status.APPROVED);
    });

    it("should update the status to REJECTED and return it throught service", async () => {
      jest.spyOn(transactionRepository, "save").mockResolvedValueOnce(
        Promise.resolve({
          ...MOCK_TRANSACTION_ORM_RESPONSE,
          status: Status.REJECTED,
        })
      );

      const response = await lastValueFrom(
        transactionService.update("MOCK_TRANSACTION_ID", Status.REJECTED)
      );

      expect(response.status).toEqual(Status.REJECTED);
    });

    it("should throw a NotFoundException", async () => {
      try {
        await lastValueFrom(
          transactionService.update(
            "NOT_EXISTING_TRANSACTION_ID",
            Status.REJECTED
          )
        );
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.response).toBeDefined();
        expect(error.response.status).toEqual(HttpStatus.NOT_FOUND);
        expect(error instanceof TransactionNotFoundException).toBe(true);
      }
    });
  });
});
