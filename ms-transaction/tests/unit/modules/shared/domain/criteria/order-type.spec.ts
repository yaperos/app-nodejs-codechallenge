import {
  OrderType,
  OrderTypeEnum,
} from 'src/modules/shared/domain/criteria/order-type';
import { InvalidArgumentError } from 'src/modules/shared/domain/errors/invalid-argument.error';

import { WordMother } from '../mothers';

describe('OrderType test', () => {
  it('should throw an error for invalid value', () => {
    expect(() => {
      OrderType.fromValue(WordMother.random());
    }).toThrow(InvalidArgumentError);
  });

  it('should test isAsc function', () => {
    let orderType = new OrderType(OrderTypeEnum.ASC);
    expect(orderType.isAsc()).toBeTruthy();

    orderType = new OrderType(OrderTypeEnum.DESC);
    expect(orderType.isAsc()).toBeFalsy();
  });
});
