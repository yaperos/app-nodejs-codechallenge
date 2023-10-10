import { faker } from '@faker-js/faker';

import { TransactionCreator } from '../../../../../../../../src/contexts/transaction/transactions/application/transactionCreator';
import { Transaction } from '../../../../../../../../src/contexts/transaction/transactions/domain/transaction';
import { TransactionAccountExternalIdCredit } from '../../../../../../../../src/contexts/transaction/transactions/domain/transactionAccountExternalIdCredit';
import { TransactionAccountExternalIdDebit } from '../../../../../../../../src/contexts/transaction/transactions/domain/transactionAccountExternalIdDebit';
import { TransactionCreatedAt } from '../../../../../../../../src/contexts/transaction/transactions/domain/transactionCreatedAt';
import { TransactionId } from '../../../../../../../../src/contexts/transaction/transactions/domain/transactionId';
import {
	TransactionStatus,
	TransactionStatuses
} from '../../../../../../../../src/contexts/transaction/transactions/domain/transactionStatus';
import { TransactionTransferType } from '../../../../../../../../src/contexts/transaction/transactions/domain/transactionTransferType';
import {
	TransactionType,
	TransactionTypes
} from '../../../../../../../../src/contexts/transaction/transactions/domain/transactionType';
import { TransactionValue } from '../../../../../../../../src/contexts/transaction/transactions/domain/transactionValue';
import EventBusMock from '../../shared/domain/eventBusMock';
import { TransactionRepositoryMock } from '../__mocks__/transactionRepositoryMock';

describe('TransactionCreator', () => {
	it('creates a transaction', async () => {
		const repository = new TransactionRepositoryMock();
		const eventBus = new EventBusMock();
		const applicationService = new TransactionCreator(repository, eventBus);

		const id = TransactionId.random();
		const accountExternalIdCredit = new TransactionAccountExternalIdCredit(faker.string.uuid());
		const accountExternalIdDebit = new TransactionAccountExternalIdDebit(faker.string.uuid());
		const status = new TransactionStatus(TransactionStatuses.PENDING);
		const transferType = TransactionTransferType.fromValue(String(1));
		const type = new TransactionType(TransactionTypes.TRANSFERS);
		const value = new TransactionValue(faker.number.int({ min: 1, max: 20000 }));
		const createdAt = new TransactionCreatedAt(new Date());

		await applicationService.run({
			id,
			accountExternalIdCredit,
			accountExternalIdDebit,
			status,
			transferType,
			type,
			value,
			createdAt
		});

		repository.assertSaveHasBeenCalledWith(
			new Transaction(
				id,
				accountExternalIdCredit,
				accountExternalIdDebit,
				status,
				transferType,
				type,
				value,
				createdAt
			)
		);
	});
});
