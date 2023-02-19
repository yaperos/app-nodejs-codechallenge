/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { NewableClass } from '../../../domain/NewableClass';
import { Primitives, ValueObject } from '../../../domain/value-object/ValueObject';

export const ValueObjectTransformer = <T extends Primitives>(
	ValueObject: NewableClass<ValueObject<any>>
) => {
	return {
		to: (value: ValueObject<T>): T => value.value,
		from: (value: T): ValueObject<T> => new ValueObject(value)
	};
};
