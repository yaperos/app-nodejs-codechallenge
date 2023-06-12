import { Controller, Logger } from '@nestjs/common';
import { AntifraudService } from '../application/antifraud.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AnalyseRequestDto } from '../domain/dtos/analyse-request.dto';

@Controller()
export class AntifraudController {
  constructor(private readonly antifraudService: AntifraudService) {}

  @MessagePattern('antifraud-event-topic')
  async analyseRequest(@Payload() payload: AnalyseRequestDto) {
    Logger.log(`Request processed: ${JSON.stringify(payload, null, 2)}`);
    this.antifraudService.analyse(payload);
  }
}
