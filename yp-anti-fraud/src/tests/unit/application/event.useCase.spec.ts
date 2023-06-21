import EventUseCase from "../../../application/event.UseCase";
import { EventMessages } from "../../../domain/event.entity";
import { EventServiceMock } from "./event.useCase.mock"

const log = jest.spyOn(console, "log").mockImplementation(() => {});

describe("Transaction UseCase", () => {
    let trUseCase: EventUseCase;

    beforeEach(async() => {
        trUseCase = new EventUseCase(new EventServiceMock())
    })

    it("it should reject the transaction", async() => {
        await trUseCase.checkLimit({
            accountExternalIdCredit: "abc-de-fff-ghi",
            accountExternalIdDebit:  "abc-de-fff-ghi",
            transactionExternalId: "abc-de-fff-ghi",
            value: 1200.00,
        })

        expect(log).toBeCalledWith(EventMessages.TRANSACTION_REJECTED)
        expect(log).toBeCalledWith({
            accountExternalIdCredit: "abc-de-fff-ghi",
            accountExternalIdDebit:  "abc-de-fff-ghi",
            transactionExternalId: "abc-de-fff-ghi",
            value: 1200.00,
        })
    });

    it("it should approve the transaction", async() => {
        await trUseCase.checkLimit({
            accountExternalIdCredit: "abc-de-fff-ghi",
            accountExternalIdDebit:  "abc-de-fff-ghi",
            transactionExternalId: "abc-de-fff-ghi",
            value: 100.00,
        })

        expect(log).toBeCalledWith(EventMessages.TRANSACTION_APPROVED)
        expect(log).toBeCalledWith({
            accountExternalIdCredit: "abc-de-fff-ghi",
            accountExternalIdDebit:  "abc-de-fff-ghi",
            transactionExternalId: "abc-de-fff-ghi",
            value: 100.00,
        })
    });
});