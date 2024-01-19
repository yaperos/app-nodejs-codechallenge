import { Order } from 'src/modules/shared/domain/criteria/order';

import { OrderByMother } from './mothers/order-by.Mother';
import { OrderTypeMother } from './mothers/order-type.Mother';

describe('Order test', () => {
  it('should instance from values', () => {
    const orderBy = OrderByMother.randomValue();
    const orderType = OrderTypeMother.randomValue();
    const order = Order.fromValues({ orderBy, orderType });
    expect(order.getOrderBy()).toEqual(orderBy);
    expect(order.getOrderType()).toEqual(orderType);
  });

  it('should test order type functions', () => {
    let orderBy = OrderByMother.randomValue();
    let order = Order.asc(orderBy);
    expect(order.isAsc()).toBeTruthy();
    expect(order.getOrderBy()).toEqual(orderBy);

    orderBy = OrderByMother.randomValue();
    order = Order.desc(orderBy);
    expect(order.isAsc()).toBeFalsy();
    expect(order.getOrderBy()).toEqual(orderBy);
  });
});
