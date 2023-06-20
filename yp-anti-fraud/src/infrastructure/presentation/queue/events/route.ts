import { EventService } from "../../../services/event.service";
import EventController from "../../../controller/event.kafka.ctrl"
import { EventMessages } from "../../../../domain/event.entity";
import EventUseCase from "../../../../application/event.UseCase";

const loadConsumer = async () => {
    const serv = new EventService();
    const eventUseCase = new EventUseCase(serv);
    await new EventController(eventUseCase,[EventMessages.TRANSACTION_CREATED]).connect()
}

export default loadConsumer;