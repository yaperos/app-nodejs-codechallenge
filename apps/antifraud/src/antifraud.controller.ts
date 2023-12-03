import { Controller } from '@nestjs/common';
import { AntifraudService } from './antifraud.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AntifraudController {
  constructor(private readonly antifraudService: AntifraudService) {}

  @MessagePattern('antifraud.validate')
  validate(@Payload() { id, value }: any) {
    console.log({ id, value });
    this.antifraudService.confirmed(id, value);
  }
}
