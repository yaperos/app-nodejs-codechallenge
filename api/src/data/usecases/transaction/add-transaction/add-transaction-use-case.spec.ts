import { IAddTransactionRepository } from 'data/protocols/db';
import { AddTransactionUseCase } from './add-transaction-use-case';
import { AddTransactionModel } from '@domain/usecases/add-transaction-use-case';
import { IExistsTransferByIdRepository } from '@data/protocols/db/transfer/exists-transfer-by-id-repository';
import { left, right } from '@domain/logic/Either';
import { TransferNotFoundError } from '@domain/error';
import { TransactionEntity } from '@domain/entities/transaction';
import { TransactionStatusEnum } from '@shared/enum/transaction-status-enum';
import { IQueueSenderService } from '@data/protocols/services/queue-service';
import { kafkaQueueConfig } from '@shared/config/queue/kafka-config';

describe('Add Transaction Use Case', () => {
	it('should call repository with correct values', async () => {
		const { sut, addTransactionRepositoryStub } = makeSut();
		const createSpy = jest.spyOn(addTransactionRepositoryStub, 'create');
		const model = makeFakeModel();
		await sut.execute(model);

		expect(createSpy).toHaveBeenCalledWith({
			...model,
			status: TransactionStatusEnum.PENDING
		});
	});

	it('should throw if repository throws.', async () => {
		const { sut, addTransactionRepositoryStub } = makeSut();
		jest
			.spyOn(addTransactionRepositoryStub, 'create')
			.mockReturnValueOnce(Promise.reject(new Error()));
		const model = makeFakeModel();
		const promise = sut.execute(model);

		expect(promise).rejects.toThrow();
	});

	it('should return a TransferNotFoundError if transfer not exists.', async () => {
		const { sut, existsTransferByIdRepositoryStub } = makeSut();
		jest
			.spyOn(existsTransferByIdRepositoryStub, 'existsById')
			.mockReturnValueOnce(Promise.resolve(false));

		const result = await sut.execute(makeFakeModel());

		expect(result).toEqual(left(new TransferNotFoundError()));
		expect(result.value).toBeInstanceOf(TransferNotFoundError);
	});

	it('should return a transaction on use case succeeds.', async () => {
		const { sut } = makeSut();

		const result = await sut.execute(makeFakeModel());

		expect(result).toEqual(
			right({
				accountExternalIdDebit: 'Guid',
				accountExternalIdCredit: 'Guid',
				transactionExternalId: 'any_uuid',
				status: TransactionStatusEnum.PENDING,
				transferTypeId: 1,
				value: 120
			})
		);
	});

	it('should call queue service with correct values', async () => {
		const { sut, validateTransactionQueueServiceStub } = makeSut();
		const sendSpy = jest.spyOn(validateTransactionQueueServiceStub, 'send');
		const model = makeFakeModel();
		await sut.execute(model);

		expect(sendSpy).toHaveBeenCalledWith(
			makeFakeTransactionEntity(),
			kafkaQueueConfig.transaction.validateTransactionTopic
		);
	});
});

type SutTypes = {
	sut: AddTransactionUseCase;
	addTransactionRepositoryStub: IAddTransactionRepository;
	existsTransferByIdRepositoryStub: IExistsTransferByIdRepository;
	validateTransactionQueueServiceStub: IQueueSenderService<
		Omit<TransactionEntity, 'id'>,
		void
	>;
};

const makeFakeModel = (): AddTransactionModel => {
	return {
		accountExternalIdDebit: 'Guid',
		accountExternalIdCredit: 'Guid',
		transferTypeId: 1,
		value: 120
	};
};

const makeExistsTransferByIdRepositoryStub = (): IExistsTransferByIdRepository => {
	class ExistsTransferByIdRepositoryStub implements IExistsTransferByIdRepository {
		existsById(id: number): Promise<boolean> {
			return Promise.resolve(true);
		}
	}

	return new ExistsTransferByIdRepositoryStub();
};

const makeValidateTransactionQueueServiceStub = (): IQueueSenderService<
	Omit<TransactionEntity, 'id'>,
	void
> => {
	class ValidateTransactionQueueServiceStub
		implements IQueueSenderService<Omit<TransactionEntity, 'id'>, void>
	{
		send(message: Omit<TransactionEntity, 'id'>, topic: string): Promise<void> {
			return Promise.resolve();
		}
	}

	return new ValidateTransactionQueueServiceStub();
};

const makeAddTransactionRepositoryStub = (): IAddTransactionRepository => {
	class AddTransactionRepositoryStub implements IAddTransactionRepository {
		create(model: TransactionEntity): Promise<TransactionEntity> {
			return Promise.resolve(makeFakeTransactionEntity());
		}
	}

	return new AddTransactionRepositoryStub();
};

const makeFakeTransactionEntity = (): TransactionEntity => {
	return {
		accountExternalIdDebit: 'Guid',
		accountExternalIdCredit: 'Guid',
		transactionExternalId: 'any_uuid',
		status: TransactionStatusEnum.PENDING,
		transferTypeId: 1,
		value: 120
	};
};

const makeSut = (): SutTypes => {
	const addTransactionRepositoryStub = makeAddTransactionRepositoryStub();
	const existsTransferByIdRepositoryStub = makeExistsTransferByIdRepositoryStub();
	const validateTransactionQueueServiceStub = makeValidateTransactionQueueServiceStub();
	const sut = new AddTransactionUseCase(
		existsTransferByIdRepositoryStub,
		addTransactionRepositoryStub,
		validateTransactionQueueServiceStub
	);

	return {
		sut,
		addTransactionRepositoryStub,
		existsTransferByIdRepositoryStub,
		validateTransactionQueueServiceStub
	};
};
