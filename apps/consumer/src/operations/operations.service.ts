import { Inject, Injectable, Logger } from "@nestjs/common";
import TransactionInDto from "./dto/transaction.in.dto";
import { ClientProxy } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";

@Injectable()
export default class OperationsService {
  private readonly topic: string;

  constructor(
    @Inject("KAFKA_PRODUCER") private readonly kafka: ClientProxy,
    private readonly configService: ConfigService,
  ) {
    this.topic = this.configService.getOrThrow<string>("KAFKA_TOPIC_UPDATED");
  }
  public processTransactions = async (dto: TransactionInDto) => {
    Logger.log(dto, OperationsService.name);
    const { id, value } = dto;

    let status: number = 1;
    if (value >= 1000) {
      Logger.error("Is fraud");
      status = 1;
    } else Logger.log("It's ok");
    return this.kafka.emit(this.topic, { value: { id, status } });
  };
}
