import {
  OrderType,
  OrderTypeEnum,
} from 'src/modules/shared/domain/criteria/order-type';

import { EnumMother } from '../../mothers';

export class OrderTypeMother {
  static random(): OrderType {
    return new OrderType(this.randomValue());
  }

  static randomValue(): OrderTypeEnum {
    return EnumMother.random(OrderTypeEnum);
  }
}
