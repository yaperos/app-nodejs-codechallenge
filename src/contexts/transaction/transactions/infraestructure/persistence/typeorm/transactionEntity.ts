import { EntitySchema } from 'typeorm';

import { ValueObjectTransformer } from '../../../../../shared/infrastructure/persistence/typeorm/valueObjectTransformer';
import { Transaction } from '../../../domain/transaction';
import { TransactionAccountExternalIdCredit } from '../../../domain/transactionAccountExternalIdCredit';
import { TransactionAccountExternalIdDebit } from '../../../domain/transactionAccountExternalIdDebit';
import { TransactionCreatedAt } from '../../../domain/transactionCreatedAt';
import { TransactionId } from '../../../domain/transactionId';
import { TransactionStatus } from '../../../domain/transactionStatus';
import { TransactionTransferType } from '../../../domain/transactionTransferType';
import { TransactionType } from '../../../domain/transactionType';
import { TransactionValue } from '../../../domain/transactionValue';

export const TransactionEntity = new EntitySchema<Transaction>({
	name: 'Transaction',
	tableName: 'transactions',
	target: Transaction,
	columns: {
		id: {
			type: String,
			primary: true,
			transformer: ValueObjectTransformer(TransactionId)
		},
		accountExternalIdCredit: {
			type: String,
			transformer: ValueObjectTransformer(TransactionAccountExternalIdCredit)
		},
		accountExternalIdDebit: {
			type: String,
			transformer: ValueObjectTransformer(TransactionAccountExternalIdDebit)
		},
		status: {
			type: String,
			transformer: ValueObjectTransformer(TransactionStatus)
		},
		transferType: {
			type: String,
			transformer: ValueObjectTransformer(TransactionTransferType)
		},
		type: {
			type: String,
			transformer: ValueObjectTransformer(TransactionType)
		},
		value: {
			type: Number,
			transformer: ValueObjectTransformer(TransactionValue)
		},
		createdAt: {
			type: Date,
			transformer: ValueObjectTransformer(TransactionCreatedAt)
		}
	}
});
