import { KafkaEvent } from "libs/src";
import { Antifraud } from "../domain/Antifraud";
import { AntifraudServiceI } from "../service/AntifraudServiceI";
import { verifyTransactionSchema } from "./Antifraud.schema";

export interface AntifraudControllerProps {
  service: AntifraudServiceI;
}

export class AntifraudController {
  constructor(private readonly props: AntifraudControllerProps) {}

  async processVerifyTransaction(event: KafkaEvent) {
    const request = await verifyTransactionSchema.validate(event.value, {
      stripUnknown: true,
    });
    const response = await this.props.service.processVerifyTransaction(
      new Antifraud({
        transaction: request,
      })
    );
    return response.getEventData();
  }
}
