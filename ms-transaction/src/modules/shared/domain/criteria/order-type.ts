import { InvalidArgumentError } from '../errors/invalid-argument.error';
import { EnumValueObject } from '../value-object/enum-value-object';

export enum OrderTypeEnum {
  ASC = 'asc',
  DESC = 'desc',
}

export class OrderType extends EnumValueObject<OrderTypeEnum> {
  constructor(value: OrderTypeEnum) {
    super(value, Object.values(OrderTypeEnum));
  }

  static fromValue(value: string): OrderType {
    for (const orderTypeValue of Object.values(OrderTypeEnum)) {
      if (value === orderTypeValue.toString()) {
        return new OrderType(orderTypeValue);
      }
    }

    throw new InvalidArgumentError(`The order type ${value} is invalid`);
  }

  public isAsc(): boolean {
    return this.value === OrderTypeEnum.ASC;
  }
}
