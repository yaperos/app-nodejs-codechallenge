import { DateMother } from './date.mother';
import { IntegerMother } from './integer.mother';
import { StringMother } from './string.mother';

export class ObjectMother {
  static random(): any {
    return {
      fieldDate: DateMother.random(),
      fieldInteger: IntegerMother.random(),
      fieldString: StringMother.random(),
    };
  }
}
