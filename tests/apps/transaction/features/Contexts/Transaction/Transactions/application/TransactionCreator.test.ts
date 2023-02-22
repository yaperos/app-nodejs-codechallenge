import { faker } from '@faker-js/faker';

import { TransactionCreator } from '../../../../../../../../src/Contexts/Transaction/Transactions/application/TransactionCreator';
import { Transaction } from '../../../../../../../../src/Contexts/Transaction/Transactions/domain/Transaction';
import { TransactionAccountExternalIdCredit } from '../../../../../../../../src/Contexts/Transaction/Transactions/domain/TransactionAccountExternalIdCredit';
import { TransactionAccountExternalIdDebit } from '../../../../../../../../src/Contexts/Transaction/Transactions/domain/TransactionAccountExternalIdDebit';
import { TransactionCreatedAt } from '../../../../../../../../src/Contexts/Transaction/Transactions/domain/TransactionCreatedAt';
import { TransactionId } from '../../../../../../../../src/Contexts/Transaction/Transactions/domain/TransactionId';
import {
	TransactionStatus,
	TransactionStatuses
} from '../../../../../../../../src/Contexts/Transaction/Transactions/domain/TransactionStatus';
import { TransactionTransferType } from '../../../../../../../../src/Contexts/Transaction/Transactions/domain/TransactionTransferType';
import {
	TransactionType,
	TransactionTypes
} from '../../../../../../../../src/Contexts/Transaction/Transactions/domain/TransactionType';
import { TransactionValue } from '../../../../../../../../src/Contexts/Transaction/Transactions/domain/TransactionValue';
import EventBusMock from '../../shared/domain/EventBusMock';
import { TransactionRepositoryMock } from '../__mocks__/TransactionRepositoryMock';

describe('TransactionCreator', () => {
	it('creates a transaction', async () => {
		const repository = new TransactionRepositoryMock();
		const eventBus = new EventBusMock();
		const applicationService = new TransactionCreator(repository, eventBus);

		const id = TransactionId.random();
		const accountExternalIdCredit = new TransactionAccountExternalIdCredit(faker.datatype.uuid());
		const accountExternalIdDebit = new TransactionAccountExternalIdDebit(faker.datatype.uuid());
		const status = new TransactionStatus(TransactionStatuses.PENDING);
		const transferType = TransactionTransferType.fromValue(String(1));
		const type = new TransactionType(TransactionTypes.TRANSFERS);
		const value = new TransactionValue(faker.datatype.number({ min: 1, max: 20000 }));
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
