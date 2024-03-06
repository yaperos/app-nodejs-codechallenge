import { Either, right, left } from '@domain/logic/Either';
import { MissingParamError } from '@presentation/errors';
import { IValidation } from '@presentation/protocols';
import { ValidationComposite } from './validation-composite';

interface SutTypes {
	sut: ValidationComposite;
	validationStubs: IValidation[];
}

const makeValidationStub = (): IValidation => {
	class ValidateStub implements IValidation {
		validate(input: any): Either<Error, null> {
			return right(null);
		}
	}
	return new ValidateStub();
};

const makeSut = (): SutTypes => {
	const validationStubs = [makeValidationStub(), makeValidationStub()];
	const sut = new ValidationComposite(validationStubs);
	return {
		sut,
		validationStubs
	};
};

describe('ValidationComposite', () => {
	it('Should return an Error if any validation fails', () => {
		const { sut, validationStubs } = makeSut();

		jest
			.spyOn(validationStubs[1], 'validate')
			.mockReturnValueOnce(left(new MissingParamError('field')));

		const error = sut.validate({ field: 'any_value' });
		expect(error).toEqual(left(new MissingParamError('field')));
	});

	it('Should return the first error if more then one validation fails', () => {
		const { sut, validationStubs } = makeSut();
		jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(left(new Error()));
		jest
			.spyOn(validationStubs[1], 'validate')
			.mockReturnValueOnce(left(new MissingParamError('field')));

		const error = sut.validate({ field: 'any_value' });
		expect(error).toEqual(left(new Error()));
	});

	it('Should return null if validation succeeds', () => {
		const { sut } = makeSut();
		const ok = sut.validate({ field: 'any_name' });
		expect(ok).toEqual(right(null));
	});
});
