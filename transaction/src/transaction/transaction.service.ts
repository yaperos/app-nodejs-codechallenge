import { BadRequestException, Injectable } from '@nestjs/common';
import { Transaction } from './entities/transaction.entity';
import { v4 as uuidv4 } from 'uuid';
import { CreateTransactionRequestDto } from './dto/create-transaction.req.dto';

@Injectable()
export class TransactionService {
	public async getByTransactionExternalId(transactionExternalId: string): Promise<Transaction> {
		const transactionDb: Transaction | null = await Transaction.findOne({ where: { transactionExternalId } });

		if (!transactionDb) throw new BadRequestException('transaction not found');

		return transactionDb;
	}

	// En el punto de creación (POST /transactions), antes de guardar
	//la transacción en la base de datos, realiza la validación contra el servicio anti-fraude.
	// Si el valor de la transacción es mayor que 1000, envía una solicitud al
	// servicio anti-fraude para su validación.
	// Si la validación es exitosa, actualiza el estado de la transacción a "approved".
	// Si es rechazada, actualiza el estado a "rejected".
	// Guarda la transacción en la base de datos con el estado correspondiente.
	public async create(request: CreateTransactionRequestDto): Promise<Transaction> {
		const transaction = new Transaction();
		transaction.transactionExternalId = uuidv4();
		transaction.accountExternalIdDebit = request.accountExternalIdDebit;
		transaction.accountExternalIdCredit = request.accountExternalIdCredit;
		transaction.tranferTypeId = request.tranferTypeId;
		transaction.transactionType = 'transfer';
		transaction.transactionStatus = 'pending';
		transaction.value = request.value;
		transaction.createdAt = new Date();
		transaction.updateAt = new Date();

		return await transaction.save();
	}
}
