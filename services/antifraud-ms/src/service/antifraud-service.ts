import {
  BadRequestError,
  EventManager,
} from "@app-nodejs-codechallenge/shared-lib";
import { Antifraud } from "../domain/antifraud";
import type { AntifraudServiceI } from "./antifraud-service.interface";

export type AntifraudServiceProps = {
  eventManager: EventManager;
};

export class AntifraudService implements AntifraudServiceI {
  constructor(private props: AntifraudServiceProps) {}

  processTransactionCreateEvent(request: Antifraud): Promise<Antifraud> {
    return this.props.eventManager.update(() => {
      if (request.transaction.transactionStatus.name !== "pending") {
        throw new BadRequestError({
          message: "Transaction status is not pending",
        });
      }

      // Fraud value assignment: random number between 0 (included) and 2000 (included), using
      // `Math.floor(Math.random() * (max - min + 1)) + min;`, in a real world scenario this
      // value should be calculated based on the request data and external sources (repository)
      const score = Math.floor(Math.random() * 2001);

      return Promise.resolve(new Antifraud({ ...request, score }));
    });
  }
}
