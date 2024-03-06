import { IValidation } from '@presentation/protocols';
import { ValidationComposite, RequiredFieldValidation } from '@validation/validators';

export const makeCreateTransactionValidation = (): ValidationComposite => {
	const validations: IValidation[] = [];
	for (const field of [
		'accountExternalIdDebit',
		'accountExternalIdCredit',
		'transferTypeId',
		'value'
	]) {
		validations.push(new RequiredFieldValidation(field));
	}

	return new ValidationComposite(validations);
};
