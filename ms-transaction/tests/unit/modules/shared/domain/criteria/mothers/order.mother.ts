import { Order } from 'src/modules/shared/domain/criteria/order';

import { OrderByMother } from './order-by.mother';
import { OrderTypeMother } from './order-type.mother';

export class OrderMother {
  static create({
    orderBy = OrderByMother.randomValue(),
    orderType = OrderTypeMother.randomValue(),
  }: {
    orderBy?: string;
    orderType?: string;
  }): Order {
    return Order.fromValues({ orderBy, orderType });
  }

  static random(): Order {
    return new Order(OrderByMother.random(), OrderTypeMother.random());
  }
}
