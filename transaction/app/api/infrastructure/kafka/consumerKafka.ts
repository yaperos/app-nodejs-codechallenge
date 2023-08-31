import { PrismaClient } from "@prisma/client";
import { consumer } from "../../../shared/infrastructure/kafka";
import Topics from "../../domain/topic/topics";
import { PrismaTransactionRepository } from "../persistence/prisma/PrismaTransactionRepository";
import { ITransactionPersistence } from "../../domain/transaction/objects/ITransactionPersistence";

export async function consumerKafka() {
  const prisma = new PrismaClient();
  const transactionRepository = new PrismaTransactionRepository(prisma);
  console.log("algo paso");
  consumer.subscribe({ topic: Topics.result, fromBeginning: true });
  consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (!message || !message.value) {
        return;
      }

      const data: ITransactionPersistence = JSON.parse(
        message.value.toString()
      );
      console.log(data);
      data.updatedAt = new Date();
      transactionRepository.updateTransaction(data);
    },
  });
}
