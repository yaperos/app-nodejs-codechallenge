import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AntiFraudServiceService } from './anti-fraud-service.service';
import { CreateAntiFraudServiceDto } from './dto/create-anti-fraud-service.dto';


@Controller()
export class AntiFraudServiceController {
  constructor(private readonly antiFraudServiceService: AntiFraudServiceService) {}
  @MessagePattern('transactions.created')
  create(@Payload() createAntiFraudServiceDto: CreateAntiFraudServiceDto) {
    console.log("transactions.created", createAntiFraudServiceDto)
   this.antiFraudServiceService.create(createAntiFraudServiceDto);
  }
}


