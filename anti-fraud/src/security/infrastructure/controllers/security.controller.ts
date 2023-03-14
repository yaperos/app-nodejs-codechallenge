import { Controller, Inject } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import {
  APPROVED_TRANSACTION,
  REJECTED_TRANSACTION,
  SecurityKey,
  TRANSACTION_CREATED,
} from 'src/security/domain/ports';
import { SecurityService } from '../../application/security.service';
import { CreateSecurityDto } from '../../dto/create-security.dto';

@Controller()
export class SecurityController {
  constructor(
    private readonly securityService: SecurityService,
    @Inject(SecurityKey.KAFKA_CLIENT)
    private readonly transactionClient: ClientKafka,
  ) {}

  @MessagePattern(TRANSACTION_CREATED)
  create(@Payload() createSecurityDto: CreateSecurityDto) {
    const transaction = this.securityService.create(createSecurityDto);
    if (transaction) {
      return this.transactionClient.emit(
        APPROVED_TRANSACTION,
        JSON.stringify(createSecurityDto),
      );
    }
    return this.transactionClient.emit(
      REJECTED_TRANSACTION,
      JSON.stringify(createSecurityDto),
    );
  }
  onModuleInit() {
    // this.transactionClient.subscribeToResponseOf(TRANSACTION_CREATED);
    this.transactionClient.connect();
  }
  onModuleDestroy() {
    this.transactionClient.close();
  }
}
