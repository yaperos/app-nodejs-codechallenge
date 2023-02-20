/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { EntitySchema } from 'typeorm';

import { ValueObjectTransformer } from '../../../../../Shared/infrastructure/persistence/typeorm/ValueObjectTransformer';
import { Transaction } from '../../../domain/Transaction';
import { TransactionAccountExternalIdCredit } from '../../../domain/TransactionAccountExternalIdCredit';
import { TransactionAccountExternalIdDebit } from '../../../domain/TransactionAccountExternalIdDebit';
import { TransactionCreatedAt } from '../../../domain/TransactionCreatedAt';
import { TransactionId } from '../../../domain/TransactionId';
import { TransactionStatus } from '../../../domain/TransactionStatus';
import { TransactionTransferType } from '../../../domain/TransactionTransferType';
import { TransactionType } from '../../../domain/TransactionType';
import { TransactionValue } from '../../../domain/TransactionValue';

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
