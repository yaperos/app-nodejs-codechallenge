import { TransactionRepository } from "../../../repositories/transaction.repository";
import EventController from "../../../controller/event.kafka.ctrl"
import { EventMessages } from "../../../../domain/event.entity";
import EventUseCase from "../../../../application/event.UseCase";

const loadConsumer = () => {
    const repo = new TransactionRepository();
    const eventUseCase = new EventUseCase(repo);
    new EventController(eventUseCase,[EventMessages.TRANSACTION_APPROVED, EventMessages.TRANSACTION_REJECTED]).connect()
}

export default loadConsumer;