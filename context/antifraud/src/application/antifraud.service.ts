import { Inject, Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { MessageBrokerDto } from "../infrastructure/dto/message-broker.dto";

@Injectable()
export class AntifraudService {
  constructor(
    @Inject("KAFKA_CLIENT") private readonly clientKafka: ClientKafka,
  ) {}

  async onModuleInit() {
    this.clientKafka.subscribeToResponseOf("transaction.validated");
    await this.clientKafka.connect();
  }

  validateStatus(content: any) {
    const isValid = content.value <= Number(process.env.KAFKA_TRANSACTION_LIMIT);
    this.clientKafka.emit(
      "transaction.validated",
      this.buildMessageOutput(content.id, isValid),
    );
  }

  private buildMessageOutput(
    id: string,
    isValid: boolean,
  ): MessageBrokerDto<object> {
    return {
      type: "transaction_validated",
      date: new Date(),
      content: {
        id,
        isValid,
      },
    };
  }
}
