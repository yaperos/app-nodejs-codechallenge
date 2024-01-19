import { FilterField } from './filter-field';
import { FilterOperator, Operator } from './filter-operator';
import { FilterValue } from './filter-value';

export interface FilterProps {
  field: string;
  operator: string;
  value: string;
}

export class Filter {
  constructor(
    private field: FilterField,
    private operator: FilterOperator,
    private value: FilterValue,
  ) {
    this.field = field;
    this.operator = operator;
    this.value = value;
  }

  static fromValues({ field, operator, value }: FilterProps): Filter {
    return new Filter(
      new FilterField(field),
      FilterOperator.fromValue(operator),
      new FilterValue(value),
    );
  }

  public toValues(): FilterProps {
    return {
      field: this.getField(),
      operator: this.getOperator(),
      value: this.getValue(),
    };
  }

  public getField(): string {
    return this.field.value;
  }

  public getOperator(): Operator {
    return this.operator.value;
  }

  public getValue(): string {
    return this.value.value;
  }
}
