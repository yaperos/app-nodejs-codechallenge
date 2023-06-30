import { Injectable } from '@nestjs/common';
import { ValidateTransactionRequestDto } from '../adapter/in/event/dto/validate-transaction-request-dto';
import { TransactionStatus, ValidateTransactionResponseDto } from '../adapter/out/event/dto/validate-transaction-response-dto';

@Injectable()
export class AntiFraudService {

    async validate(validateTransactionRequestDto: ValidateTransactionRequestDto): Promise<ValidateTransactionResponseDto> {
        const validateTransactionResponseDto = new ValidateTransactionResponseDto();
        validateTransactionResponseDto.traceabilityId = validateTransactionRequestDto.traceabilityId;

        if (validateTransactionRequestDto.value > 1000) {
            validateTransactionResponseDto.transactionStatus = TransactionStatus.REJECTED;

        } else {
                validateTransactionResponseDto.transactionStatus = TransactionStatus.APPROVED;
        }

        return validateTransactionResponseDto;
    }
}