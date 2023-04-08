import { kafkaService } from "../../services";
import { NotifyKafka } from "./NotifyKafka";

const notifyKafka = new NotifyKafka(kafkaService);

export { notifyKafka };
