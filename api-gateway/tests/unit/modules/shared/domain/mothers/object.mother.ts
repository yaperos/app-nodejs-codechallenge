import { DateMother } from './date.Mother';
import { IntegerMother } from './integer.Mother';
import { StringMother } from './string.Mother';

export class ObjectMother {
  static random(): any {
    return {
      fieldDate: DateMother.random(),
      fieldInteger: IntegerMother.random(),
      fieldString: StringMother.random(),
    };
  }
}
