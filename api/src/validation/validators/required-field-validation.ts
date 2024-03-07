import { Either, right, left } from '@domain/logic/Either';
import { MissingParamError } from '@presentation/errors';
import { IValidation } from '@presentation/protocols';

export class RequiredFieldValidation implements IValidation {
	constructor(private readonly fieldName: string) {}

	public validate(input: any): Either<Error, null> {
		const param = input[this.fieldName];

		if (param === 0 || param === false) {
			return right(null);
		}

		if (
			(Array.isArray(param) && (param as []).length === 0) ||
			(typeof param === 'string' && param.trim().length === 0) ||
			!param
		) {
			return left(new MissingParamError(this.fieldName));
		}

		return right(null);
	}
}
