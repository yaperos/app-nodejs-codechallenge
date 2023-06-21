import TransactionUseCase from "../../../application/transaction.UseCase";
import EventUseCase from "../../../application/event.UseCase";
import { TransactionStates } from "../../../domain/transaction.entity";
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
            tranferTypeId: 1,
            value: 120.00,
        })

        expect(transaction).not.toBeNull();
        expect(transaction?.accountExternalIdCredit).toBe("abc-de-fff-ghi")
        expect(transaction?.accountExternalIdDebit).toBe("abc-de-fff-ghi")
        expect(transaction?.tranferTypeId).toBe(1)
        expect(transaction?.value).toBe(120.00)
        expect(transaction?.createdAt).not.toBeUndefined()
        expect(transaction?.createdAtTimestamp).not.toBeUndefined()
        expect(transaction?.transactionExternalId).not.toBeUndefined()
        expect(transaction?.status).toBe(TransactionStates.TRANSACTION_PENDING)
        expect(log).toBeCalledWith(EventMessages.TRANSACTION_CREATED)
        expect(log).toBeCalledWith({
            transactionExternalId: transaction?.transactionExternalId,
            accountExternalIdCredit: "abc-de-fff-ghi",
            accountExternalIdDebit:  "abc-de-fff-ghi",
            value: 120.00,
        })
    });

    it("it should not set status", async() => {
        const transaction = await trUseCase.createTransaction({
            accountExternalIdCredit: "abc-de-fff-ghi",
            accountExternalIdDebit:  "abc-de-fff-ghi",
            tranferTypeId: 1,
            value: 120.00,
            status: TransactionStates.TRANSACTION_PENDING,
        })

        expect(transaction).not.toBeNull();
        expect(transaction?.accountExternalIdCredit).toBe("abc-de-fff-ghi")
        expect(transaction?.accountExternalIdDebit).toBe("abc-de-fff-ghi")
        expect(transaction?.tranferTypeId).toBe(1)
        expect(transaction?.value).toBe(120.00)
        expect(transaction?.createdAt).not.toBeUndefined()
        expect(transaction?.createdAtTimestamp).not.toBeUndefined()
        expect(transaction?.transactionExternalId).not.toBeUndefined()
        expect(transaction?.status).toBe(TransactionStates.TRANSACTION_PENDING)
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
            tranferTypeId: 1,
            value: 120.00,
            status: TransactionStates.TRANSACTION_PENDING,
        })

        expect(transaction).not.toBeNull();
        expect(transaction?.accountExternalIdCredit).toBe("abc-de-fff-ghi")
        expect(transaction?.accountExternalIdDebit).toBe("abc-de-fff-ghi")
        expect(transaction?.tranferTypeId).toBe(1)
        expect(transaction?.value).toBe(120.00)
        expect(transaction?.createdAt).not.toBeUndefined()
        expect(transaction?.createdAtTimestamp).not.toBeUndefined()
        expect(transaction?.transactionExternalId).not.toBeUndefined()
        expect(transaction?.status).toBe(TransactionStates.TRANSACTION_PENDING)
        expect(log).toBeCalledWith(EventMessages.TRANSACTION_CREATED)
        expect(log).toBeCalledWith({
            transactionExternalId: transaction?.transactionExternalId,
            accountExternalIdCredit: "abc-de-fff-ghi",
            accountExternalIdDebit:  "abc-de-fff-ghi",
            value: 120.00,
        })

        const transaction2 = await trUseCase.findTransactionById(transaction?.transactionExternalId!)

        expect(transaction2).not.toBeNull();
        expect(transaction2?.accountExternalIdCredit).toBe("abc-de-fff-ghi")
        expect(transaction2?.accountExternalIdDebit).toBe("abc-de-fff-ghi")
        expect(transaction2?.tranferTypeId).toBe(1)
        expect(transaction2?.value).toBe(120.00)
        expect(transaction2?.createdAt).not.toBeUndefined()
        expect(transaction2?.createdAtTimestamp).not.toBeUndefined()
        expect(transaction2?.transactionExternalId).not.toBeUndefined()
        expect(transaction2?.status).toBe(TransactionStates.TRANSACTION_PENDING)
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
            tranferTypeId: 1,
            value: 120.00,
        })

        expect(transaction).not.toBeNull();
        expect(transaction?.accountExternalIdCredit).toBe("abc-de-fff-ghi")
        expect(transaction?.accountExternalIdDebit).toBe("abc-de-fff-ghi")
        expect(transaction?.tranferTypeId).toBe(1)
        expect(transaction?.value).toBe(120.00)
        expect(transaction?.createdAt).not.toBeUndefined()
        expect(transaction?.createdAtTimestamp).not.toBeUndefined()
        expect(transaction?.transactionExternalId).not.toBeUndefined()
        expect(transaction?.status).toBe(TransactionStates.TRANSACTION_PENDING)
        expect(log).toBeCalledWith(EventMessages.TRANSACTION_CREATED)
        expect(log).toBeCalledWith({
            transactionExternalId: transaction?.transactionExternalId,
            accountExternalIdCredit: "abc-de-fff-ghi",
            accountExternalIdDebit:  "abc-de-fff-ghi",
            value: 120.00,
        })

        const updTransaction = await evUseCase.updateTransaction(transaction?.transactionExternalId!, EventMessages.TRANSACTION_REJECTED);
        
        expect(updTransaction).not.toBeNull();
        expect(updTransaction?.accountExternalIdCredit).toBe("abc-de-fff-ghi")
        expect(updTransaction?.accountExternalIdDebit).toBe("abc-de-fff-ghi")
        expect(updTransaction?.tranferTypeId).toBe(1)
        expect(updTransaction?.value).toBe(120.00)
        expect(updTransaction?.createdAt).not.toBeUndefined()
        expect(updTransaction?.createdAtTimestamp).not.toBeUndefined()
        expect(updTransaction?.transactionExternalId).not.toBeUndefined()
        expect(updTransaction?.status).toBe(TransactionStates.TRANSACTION_REJECTED)
    });

    it("it should create a transaction and update accepted", async() => {
        const transaction = await trUseCase.createTransaction({
            accountExternalIdCredit: "abc-de-fff-ghi",
            accountExternalIdDebit:  "abc-de-fff-ghi",
            tranferTypeId: 1,
            value: 120.00,
        })

        expect(transaction).not.toBeNull();
        expect(transaction?.accountExternalIdCredit).toBe("abc-de-fff-ghi")
        expect(transaction?.accountExternalIdDebit).toBe("abc-de-fff-ghi")
        expect(transaction?.tranferTypeId).toBe(1)
        expect(transaction?.value).toBe(120.00)
        expect(transaction?.createdAt).not.toBeUndefined()
        expect(transaction?.createdAtTimestamp).not.toBeUndefined()
        expect(transaction?.transactionExternalId).not.toBeUndefined()
        expect(transaction?.status).toBe(TransactionStates.TRANSACTION_PENDING)
        expect(log).toBeCalledWith(EventMessages.TRANSACTION_CREATED)
        expect(log).toBeCalledWith({
            transactionExternalId: transaction?.transactionExternalId,
            accountExternalIdCredit: "abc-de-fff-ghi",
            accountExternalIdDebit:  "abc-de-fff-ghi",
            value: 120.00,
        })

        const updTransaction = await evUseCase.updateTransaction(transaction?.transactionExternalId!, EventMessages.TRANSACTION_APPROVED);
        
        expect(updTransaction).not.toBeNull();
        expect(updTransaction?.accountExternalIdCredit).toBe("abc-de-fff-ghi")
        expect(updTransaction?.accountExternalIdDebit).toBe("abc-de-fff-ghi")
        expect(updTransaction?.tranferTypeId).toBe(1)
        expect(updTransaction?.value).toBe(120.00)
        expect(updTransaction?.createdAt).not.toBeUndefined()
        expect(updTransaction?.createdAtTimestamp).not.toBeUndefined()
        expect(updTransaction?.transactionExternalId).not.toBeUndefined()
        expect(updTransaction?.status).toBe(TransactionStates.TRANSACTION_APPROVED)
    });

    it("it should create a transaction and not update invalid message", async() => {
        const transaction = await trUseCase.createTransaction({
            accountExternalIdCredit: "abc-de-fff-ghi",
            accountExternalIdDebit:  "abc-de-fff-ghi",
            tranferTypeId: 1,
            value: 120.00,
        })

        expect(transaction).not.toBeNull();
        expect(transaction?.accountExternalIdCredit).toBe("abc-de-fff-ghi")
        expect(transaction?.accountExternalIdDebit).toBe("abc-de-fff-ghi")
        expect(transaction?.tranferTypeId).toBe(1)
        expect(transaction?.value).toBe(120.00)
        expect(transaction?.createdAt).not.toBeUndefined()
        expect(transaction?.createdAtTimestamp).not.toBeUndefined()
        expect(transaction?.transactionExternalId).not.toBeUndefined()
        expect(transaction?.status).toBe(TransactionStates.TRANSACTION_PENDING)
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