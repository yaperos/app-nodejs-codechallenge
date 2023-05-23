import { type KafkaEvent } from "@app-nodejs-codechallenge/http-lib";
import { Antifraud } from "../domain/antifraud";
import { type AntifraudServiceI } from "../service/antifraud-service.interface";
import { processTransactionCreateSchema } from "./antifraud-controller.schema";

export type AntifraudControllerProps = {
  service: AntifraudServiceI;
};

export class AntifraudController {
  constructor(private readonly props: AntifraudControllerProps) {}

  processTransactionCreateEvent(event: KafkaEvent) {
    const request = processTransactionCreateSchema.parse(event);
    const transaction = new Antifraud(request);
    return this.props.service.processTransactionCreateEvent(transaction);
  }
}
