import * as kafka from "kafka-node";
import { STATUS } from "../../common/constants";
import { Transaction } from "./entity/Transaction";

const client = new kafka.KafkaClient({ kafkaHost: "localhost:9092" });

export class Service {
  async createTransaction(tran: any): Promise<any> {
    const newTran = new Transaction();
    newTran.idDebit = tran.accountExternalIdDebit;
    newTran.idCredit = tran.accountExternalIdCredit;
    newTran.transferTypeId = tran.transferTypeId;
    newTran.amount = tran.value;
    newTran.status = STATUS.PENDING;

    await newTran.save();

    if (tran.value <= 1000) {
      await Transaction.update({ id: newTran.id }, { status: STATUS.CREATED });

      const producer = new kafka.Producer(client);

      const payloads = [
        {
          topic: "transaction",
          messages: JSON.stringify({ id: newTran.id }),
        },
      ];

      producer.send(payloads, function (err, data) {
        console.log("send data", data);

        return {
          status: newTran.status,
          idTransaction: newTran.id,
        };
      });
    }

    return {
      status: newTran.status,
      idTransaction: newTran.id,
    };
  }

  async updateTransaction(tran: any): Promise<any> {
    const transaction = await Transaction.findOneBy({ id: tran.idTran });

    if (!transaction) {
      return {
        message: "Not transaction found!",
      };
    }

    await Transaction.update(
      { id: parseInt(tran.idTran) },
      { status: tran.status }
    );

    return {
      idTransaction: transaction.id,
      status: transaction.status,
    };
  }

  async getTransaction(id: number): Promise<any> {
    const transaction = await Transaction.findOneBy({ id: id });

    if (!transaction) {
      return {
        message: "Not transaction found",
      };
    }

    return {
      transactionExternalId: transaction.idCredit,
      transactionType: {
        name: "Yape",
      },
      transactionStatus: {
        name: transaction.status,
      },
      value: transaction.amount,
      createdAt: transaction.createdAt.toDateString(),
    };
  }
}
