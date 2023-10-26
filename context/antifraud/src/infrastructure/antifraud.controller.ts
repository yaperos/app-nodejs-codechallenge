import { AntifraudService } from "../application/antifraud.service";
import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { MessageBrokerDto } from "./dto/message-broker.dto";

@Controller()
export class AntifraudController {
  constructor(private readonly antifraudService: AntifraudService) {}

  @EventPattern("transaction.created")
  handleTransactionCreated(@Payload() message: MessageBrokerDto<any>) {
    this.antifraudService.validateStatus(message.content);
  }
}
