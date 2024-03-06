import { left, right, Either } from '@domain/logic/Either';
import {
	IAddTransactionUseCase,
	AddTransactionModel,
	AddTransactionUseCaseResult
} from '@domain/usecases/add-transaction-use-case';
import { badRequest } from '@presentation/helpers/http/http-helper';
import { IValidation, HttpRequest } from '@presentation/protocols';
import { CreateTransactionController } from './create-transaction-controller';
import { TransactionStatusEnum } from '@shared/enum/transaction-status-enum';

describe('Create Transaction Controller', () => {
	it('Should call validation with correct values', async () => {
		const { sut, validationStub } = makeSut();

		const authSpy = jest.spyOn(validationStub, 'validate');

		await sut.handle(makeFakeRequest());
		expect(authSpy).toHaveBeenCalledWith({
			accountExternalIdDebit: 'Guid',
			accountExternalIdCredit: 'Guid',
			transferTypeId: 1,
			value: 120
		});
	});

	it('Should return bad request if http request is invalid.', async () => {
		const { sut, validationStub } = makeSut();

		jest.spyOn(validationStub, 'validate').mockReturnValueOnce(left(new Error()));

		const httpResponse = await sut.handle(makeFakeRequest());

		expect(httpResponse).toEqual(badRequest(new Error()));
	});

	it('Should return bad request if use case fails.', async () => {
		const { sut, useCaseStub } = makeSut();

		jest
			.spyOn(useCaseStub, 'execute')
			.mockReturnValueOnce(Promise.resolve(left(new Error())));

		const httpResponse = await sut.handle(makeFakeRequest());

		expect(httpResponse).toEqual(badRequest(new Error()));
	});

	it('Should return server error if use case throws.', async () => {
		const { sut, useCaseStub } = makeSut();

		jest.spyOn(useCaseStub, 'execute').mockReturnValueOnce(Promise.reject(new Error()));

		const httpResponse = sut.handle(makeFakeRequest());

		expect(httpResponse).rejects.toThrow();
	});
});

type SutTypes = {
	sut: CreateTransactionController;
	validationStub: IValidation;
	useCaseStub: IAddTransactionUseCase;
};

const makeUseCaseStub = (): IAddTransactionUseCase => {
	class AddTransactionUseCaseStub implements IAddTransactionUseCase {
		async execute(dto: AddTransactionModel): Promise<AddTransactionUseCaseResult> {
			return Promise.resolve(
				right({
					accountExternalIdDebit: 'Guid',
					accountExternalIdCredit: 'Guid',
					transactionExternalId: 'any_uuid',
					status: TransactionStatusEnum.PENDING,
					transferTypeId: 1,
					value: 120
				})
			);
		}
	}

	return new AddTransactionUseCaseStub();
};

const makeValidation = (): IValidation => {
	class ValidationStub implements IValidation {
		validate(input: any): Either<Error, null> {
			return right(null);
		}
	}

	return new ValidationStub();
};

const makeFakeRequest = (): HttpRequest => {
	return {
		body: {
			accountExternalIdDebit: 'Guid',
			accountExternalIdCredit: 'Guid',
			transferTypeId: 1,
			value: 120
		}
	};
};

const makeSut = (): SutTypes => {
	const useCaseStub = makeUseCaseStub();
	const validationStub = makeValidation();

	const sut = new CreateTransactionController(validationStub, useCaseStub);

	return { sut, validationStub, useCaseStub };
};
