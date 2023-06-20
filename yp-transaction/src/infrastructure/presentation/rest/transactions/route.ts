import Express, {Http} from "../../../../libs/express"
import { joiNumber, joiError, joiString, joiObj } from "../../../../libs/joi";
import TransactionUseCase from "../../../../application/transaction.UseCase";
import TransactionController from "../../../controller/transaction.ctrl"
import { TransactionRepository } from "../../../repositories/transaction.repository";
import { EventService } from "../../../services/event.service";

const repo = new TransactionRepository();
const eventSer = new EventService();
const useCase = new TransactionUseCase(repo, eventSer);
const controller = new TransactionController(useCase);

const loadTransactions = () => {
    return Express.createRoute({
        caseSensitive: true,
        mergeParams: false,
        strict: true,
        version: "v1",
        subject: "transactions",
        routes: [
            {
                method: Http.Post,
                url: "",
                validate: {
                    payload: joiObj({
                        accountExternalIdDebit: joiString(36,36).required().error(joiError({code : '*1'})),
                        accountExternalIdCredit: joiString(36,36).required().error(joiError({code : '*2'})),
                        tranferTypeId: joiNumber(1).required().error(joiError({code : '*3'})),
                        value: joiNumber(1).required().error(joiError({code : '*4'})),
                    }),
                },
                handler: controller.createTransaction,
            },
            {
                method: Http.Get,
                url: "/:id",
                validate: {
                    params: joiObj({
                        id: joiString(36,36).required().error(joiError({code : '*1'})),
                    }),
                },
                handler: controller.findTransactionById,
            },
        ]
    });
}

export default loadTransactions;