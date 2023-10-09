import { NewableClass } from '../../../domain/newableClass';
import { Primitives, ValueObject } from '../../../domain/valueObject/valueObject';

export const ValueObjectTransformer = <T extends Primitives>(
	ValueObject: NewableClass<ValueObject<any>>
) => {
	return {
		to: (value: ValueObject<T>): T => value.value,
		from: (value: T): ValueObject<T> => new ValueObject(value)
	};
};
