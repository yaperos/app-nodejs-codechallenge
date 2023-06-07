import { EventManager } from "libs/src";
import { Transaction } from "../domain/Transaction";
import { TransactionRepositoryI } from "../repository/TransactionRepositoryI";
import { TransactionServiceI } from "./TransactionServiceI";

export interface TransactionServiceImplProps {
  repository: TransactionRepositoryI;
  kafkaEventManager: EventManager;
}

export class TransactionServiceImpl implements TransactionServiceI {
  constructor(private props: TransactionServiceImplProps) {}
  async findTransactionById(transaction: Transaction) {
    return this.props.kafkaEventManager.resourceRequest({
      businessLogic: async () => {
        return this.props.repository.findTransactionById(transaction);
      },
    });
  }
  async createTransaction(transaction: Transaction) {
    return this.props.kafkaEventManager.resourceCreate({
      businessLogic: async () => {
        return await this.props.repository.createTransaction(transaction);
      },
    });
  }

  async processVerifyTransaction(transaction: Transaction) {
    return this.props.kafkaEventManager.resourceUpdate({
      businessLogic: async () => {
        return this.props.repository.updateTransaction(transaction);
      },
    });
  }
}
