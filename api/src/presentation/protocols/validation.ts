import { Either } from '@domain/logic/Either';

export interface IValidation {
	validate: (input: any) => Either<Error, null>;
}
