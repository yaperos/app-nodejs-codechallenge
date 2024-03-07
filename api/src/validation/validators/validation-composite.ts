import { Either, right } from '@domain/logic/Either';
import { IValidation } from '@presentation/protocols';

export class ValidationComposite implements IValidation {
	constructor(private readonly validations: IValidation[]) {}

	validate(input: any): Either<Error, null> {
		for (const validation of this.validations) {
			const error = validation.validate(input);
			if (error.isLeft()) {
				return error;
			}
		}

		return right(null);
	}
}
