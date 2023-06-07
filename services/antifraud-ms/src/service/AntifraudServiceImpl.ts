import { EventManager } from "libs/src";
import { Antifraud, TransactionStatus } from "../domain/Antifraud";
import { AntifraudServiceI } from "./AntifraudServiceI";

export interface AntifraudServiceImplProps {
  kafkaEventManager: EventManager;
  featureFlags: {
    maxAmount: number;
  };
}

export class AntifraudServiceImpl implements AntifraudServiceI {
  constructor(private props: AntifraudServiceImplProps) {}

  async processVerifyTransaction(antifraud: Antifraud) {
    return this.props.kafkaEventManager.resourceUpdate({
      namespace: "transaction",
      businessLogic: async () => {
        const isFraud =
          antifraud.transaction.value > this.props.featureFlags.maxAmount;
        const status = isFraud
          ? TransactionStatus.REJECTED
          : TransactionStatus.APPROVED;
        return new Antifraud({
          transaction: {
            ...antifraud.transaction,
            status: status,
          },
        });
      },
    });
  }
}
