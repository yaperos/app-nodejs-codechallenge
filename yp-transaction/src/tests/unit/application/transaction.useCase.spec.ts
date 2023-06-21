import TransactionUseCase from "../../../application/transaction.UseCase";
import EventUseCase from "../../../application/event.UseCase";
import { TransactionStates,TransactionTypes } from "../../../domain/transaction.entity";
import { EventMessages } from "../../../domain/event.entity";
import { TransactionRepositoryMock, EventServiceMock } from "./transaction.useCase.mock"

const log = jest.spyOn(console, "log").mockImplementation(() => {});

describe("Transaction UseCase", () => {
    let trUseCase: TransactionUseCase;
    let evUseCase: EventUseCase;

    beforeEach(async() => {
        const trMock = new TransactionRepositoryMock();
        trUseCase = new TransactionUseCase(trMock, new EventServiceMock())
        evUseCase = new EventUseCase(trMock)
    })

    it("it should create a transaction and send to kafka service", async() => {
        const transaction = await trUseCase.createTransaction({
            accountExternalIdCredit: "abc-de-fff-ghi",
            accountExternalIdDebit:  "abc-de-fff-ghi",
            tranferTypeId: TransactionTypes.TRANSACTION_DEPOSIT,
            value: 120.00,
        })

        expect(transaction).toEqual(
            expect.objectContaining({
              accountExternalIdCredit: "abc-de-fff-ghi",
              accountExternalIdDebit: "abc-de-fff-ghi",
              tranferTypeId: TransactionTypes.TRANSACTION_DEPOSIT,
              value: 120,
              createdAt: expect.any(String),
              createdAtTimestamp: expect.any(Number),
              transactionExternalId: expect.any(String),
              status: TransactionStates.TRANSACTION_PENDING,
            })
        )
        expect(log).toBeCalledWith(EventMessages.TRANSACTION_CREATED)
        expect(log).toBeCalledWith({
            transactionExternalId: transaction?.transactionExternalId,
            accountExternalIdCredit: "abc-de-fff-ghi",
            accountExternalIdDebit:  "abc-de-fff-ghi",
            value: 120.00,
        })
    });

    it("it should not create, not valid transfer", async() => {
        expect.assertions(1)
        try {
            await trUseCase.createTransaction({
                accountExternalIdCredit: "abc-de-fff-ghi",
                accountExternalIdDebit:  "abc-de-fff-ghi",
                tranferTypeId: 12,
                value: 120.00,
            })
        } catch(e: any){
            expect(e.message).toBe("Not valid transfer type");
        }
    });

    it("it should not set status", async() => {
        const transaction = await trUseCase.createTransaction({
            accountExternalIdCredit: "abc-de-fff-ghi",
            accountExternalIdDebit:  "abc-de-fff-ghi",
            tranferTypeId: TransactionTypes.TRANSACTION_DEPOSIT,
            value: 120.00,
            status: TransactionStates.TRANSACTION_APPROVED,
        })

        expect(transaction).toEqual(
            expect.objectContaining({
              accountExternalIdCredit: "abc-de-fff-ghi",
              accountExternalIdDebit: "abc-de-fff-ghi",
              tranferTypeId: TransactionTypes.TRANSACTION_DEPOSIT,
              value: 120,
              createdAt: expect.any(String),
              createdAtTimestamp: expect.any(Number),
              transactionExternalId: expect.any(String),
              status: TransactionStates.TRANSACTION_PENDING,
            })
        )
        expect(log).toBeCalledWith(EventMessages.TRANSACTION_CREATED)
        expect(log).toBeCalledWith({
            transactionExternalId: transaction?.transactionExternalId,
            accountExternalIdCredit: "abc-de-fff-ghi",
            accountExternalIdDebit:  "abc-de-fff-ghi",
            value: 120.00,
        })
    });

    it("it should create and find the id", async() => {
        const transaction = await trUseCase.createTransaction({
            accountExternalIdCredit: "abc-de-fff-ghi",
            accountExternalIdDebit:  "abc-de-fff-ghi",
            tranferTypeId: TransactionTypes.TRANSACTION_DEPOSIT,
            value: 120.00,
            status: TransactionStates.TRANSACTION_PENDING,
        })

        expect(transaction).toEqual(
            expect.objectContaining({
              accountExternalIdCredit: "abc-de-fff-ghi",
              accountExternalIdDebit: "abc-de-fff-ghi",
              tranferTypeId: TransactionTypes.TRANSACTION_DEPOSIT,
              value: 120,
              createdAt: expect.any(String),
              createdAtTimestamp: expect.any(Number),
              transactionExternalId: expect.any(String),
              status: TransactionStates.TRANSACTION_PENDING,
            })
        )
        expect(log).toBeCalledWith(EventMessages.TRANSACTION_CREATED)
        expect(log).toBeCalledWith({
            transactionExternalId: transaction?.transactionExternalId,
            accountExternalIdCredit: "abc-de-fff-ghi",
            accountExternalIdDebit:  "abc-de-fff-ghi",
            value: 120.00,
        })

        const transaction2 = await trUseCase.findTransactionById(transaction?.transactionExternalId!)

        expect(transaction2).toEqual(
            expect.objectContaining({
              accountExternalIdCredit: "abc-de-fff-ghi",
              accountExternalIdDebit: "abc-de-fff-ghi",
              tranferTypeId: TransactionTypes.TRANSACTION_DEPOSIT,
              value: 120,
              createdAt: expect.any(String),
              createdAtTimestamp: expect.any(Number),
              transactionExternalId: expect.any(String),
              status: TransactionStates.TRANSACTION_PENDING,
            })
        )
        expect(log).toBeCalledWith(EventMessages.TRANSACTION_CREATED)
        expect(log).toBeCalledWith({
            transactionExternalId: transaction2?.transactionExternalId,
            accountExternalIdCredit: "abc-de-fff-ghi",
            accountExternalIdDebit:  "abc-de-fff-ghi",
            value: 120.00,
        })
    });

    it("it should not find an id", async() => {
        const transaction = await trUseCase.findTransactionById("abc")
        expect(transaction).toBeNull();
    });

    it("it should create a transaction and update approved", async() => {
        const transaction = await trUseCase.createTransaction({
            accountExternalIdCredit: "abc-de-fff-ghi",
            accountExternalIdDebit:  "abc-de-fff-ghi",
            tranferTypeId: TransactionTypes.TRANSACTION_DEPOSIT,
            value: 120.00,
        })

        expect(transaction).toEqual(
            expect.objectContaining({
              accountExternalIdCredit: "abc-de-fff-ghi",
              accountExternalIdDebit: "abc-de-fff-ghi",
              tranferTypeId: TransactionTypes.TRANSACTION_DEPOSIT,
              value: 120,
              createdAt: expect.any(String),
              createdAtTimestamp: expect.any(Number),
              transactionExternalId: expect.any(String),
              status: TransactionStates.TRANSACTION_PENDING,
            })
        )
        expect(log).toBeCalledWith({
            transactionExternalId: transaction?.transactionExternalId,
            accountExternalIdCredit: "abc-de-fff-ghi",
            accountExternalIdDebit:  "abc-de-fff-ghi",
            value: 120.00,
        })

        const updTransaction = await evUseCase.updateTransaction(transaction?.transactionExternalId!, EventMessages.TRANSACTION_REJECTED);
        
        expect(updTransaction).toEqual(
            expect.objectContaining({
              accountExternalIdCredit: "abc-de-fff-ghi",
              accountExternalIdDebit: "abc-de-fff-ghi",
              tranferTypeId: TransactionTypes.TRANSACTION_DEPOSIT,
              value: 120,
              createdAt: expect.any(String),
              createdAtTimestamp: expect.any(Number),
              transactionExternalId: expect.any(String),
              status: TransactionStates.TRANSACTION_REJECTED,
            })
        )
    });

    it("it should create a transaction and update accepted", async() => {
        const transaction = await trUseCase.createTransaction({
            accountExternalIdCredit: "abc-de-fff-ghi",
            accountExternalIdDebit:  "abc-de-fff-ghi",
            tranferTypeId: TransactionTypes.TRANSACTION_DEPOSIT,
            value: 120.00,
        })

        expect(transaction).toEqual(
            expect.objectContaining({
              accountExternalIdCredit: "abc-de-fff-ghi",
              accountExternalIdDebit: "abc-de-fff-ghi",
              tranferTypeId: TransactionTypes.TRANSACTION_DEPOSIT,
              value: 120,
              createdAt: expect.any(String),
              createdAtTimestamp: expect.any(Number),
              transactionExternalId: expect.any(String),
              status: TransactionStates.TRANSACTION_PENDING,
            })
        )
        expect(log).toBeCalledWith(EventMessages.TRANSACTION_CREATED)
        expect(log).toBeCalledWith({
            transactionExternalId: transaction?.transactionExternalId,
            accountExternalIdCredit: "abc-de-fff-ghi",
            accountExternalIdDebit:  "abc-de-fff-ghi",
            value: 120.00,
        })

        const updTransaction = await evUseCase.updateTransaction(transaction?.transactionExternalId!, EventMessages.TRANSACTION_APPROVED);
        
        expect(updTransaction).toEqual(
            expect.objectContaining({
              accountExternalIdCredit: "abc-de-fff-ghi",
              accountExternalIdDebit: "abc-de-fff-ghi",
              tranferTypeId: TransactionTypes.TRANSACTION_DEPOSIT,
              value: 120,
              createdAt: expect.any(String),
              createdAtTimestamp: expect.any(Number),
              transactionExternalId: expect.any(String),
              status: TransactionStates.TRANSACTION_APPROVED,
            })
        )
    });

    it("it should create a transaction and not update invalid message", async() => {
        const transaction = await trUseCase.createTransaction({
            accountExternalIdCredit: "abc-de-fff-ghi",
            accountExternalIdDebit:  "abc-de-fff-ghi",
            tranferTypeId: TransactionTypes.TRANSACTION_DEPOSIT,
            value: 120.00,
        })

        expect(transaction).toEqual(
            expect.objectContaining({
              accountExternalIdCredit: "abc-de-fff-ghi",
              accountExternalIdDebit: "abc-de-fff-ghi",
              tranferTypeId: TransactionTypes.TRANSACTION_DEPOSIT,
              value: 120,
              createdAt: expect.any(String),
              createdAtTimestamp: expect.any(Number),
              transactionExternalId: expect.any(String),
              status: TransactionStates.TRANSACTION_PENDING,
            })
        )
        expect(log).toBeCalledWith(EventMessages.TRANSACTION_CREATED)
        expect(log).toBeCalledWith({
            transactionExternalId: transaction?.transactionExternalId,
            accountExternalIdCredit: "abc-de-fff-ghi",
            accountExternalIdDebit:  "abc-de-fff-ghi",
            value: 120.00,
        })

        const updTransaction = await evUseCase.updateTransaction(transaction?.transactionExternalId!, "invalid_message");
        
        expect(updTransaction).toBeNull();
    });
});