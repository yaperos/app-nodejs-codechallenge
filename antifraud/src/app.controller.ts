import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CheckTransactionDto } from './check-transaction.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Define un patrón de mensaje para manejar la verificación de transacciones
  @MessagePattern('verify-transaction')
  handleEventVerifyTransaction(@Payload() data: CheckTransactionDto) {
    // Llama al método `verifyTransaction` del servicio `AppService` y retorna su resultado
    return this.appService.verifyTransaction(data);
  }
}
