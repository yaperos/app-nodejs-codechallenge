import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransactionValidationModel } from '../../domain/transaction-validation.model';
import { TransactionCreatedDto } from '../../infraestructure/dtos/transaction-created.dto';

@Injectable()
export class ValidateTransactionUseCase {
    constructor(private readonly configService: ConfigService) {}

    public async validate(
        data: TransactionCreatedDto,
    ): Promise<TransactionValidationModel> {
        return {
            transactionId: data.id,
            isValid: data.value <= +this.configService.get('LIMIT_TRANSACTION'),
        };
    }
}
