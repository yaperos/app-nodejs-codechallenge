import { Injectable } from '@nestjs/common';
import { ValidateTransactionDto } from './dto/validate-transaction.input';
import { TransactionStatusMap } from './util/contants';

@Injectable()
export class AppService {

	detectFraud(validateTransactionDto: ValidateTransactionDto) {

		const { v } = validateTransactionDto;

		let status: Number = TransactionStatusMap.APPROVED;

		if (+v > 1000) {
			status = TransactionStatusMap.REJECTED;
		}

		return status;
	}
}
