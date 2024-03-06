import { IValidation } from '@presentation/protocols';
import { RequiredFieldValidation, ValidationComposite } from '@validation/validators';
import { makeCreateTransactionValidation } from './create-transaction-validation-factory';

describe('CreateTransactionValidation', () => {
	it('Should call ValidationComposite with all validations', () => {
		const composite = makeCreateTransactionValidation();

		const validations: IValidation[] = [];
		for (const field of [
			'accountExternalIdDebit',
			'accountExternalIdCredit',
			'transferTypeId',
			'value'
		]) {
			validations.push(new RequiredFieldValidation(field));
		}

		expect(composite).toEqual(new ValidationComposite(validations));
	});
});
