import { OrderBy } from './order-by';
import { OrderType, OrderTypeEnum } from './order-type';

export interface OrderProps {
  orderBy: string;
  orderType: string;
}

export class Order {
  constructor(private orderBy: OrderBy, private orderType: OrderType) {}

  static fromValues({ orderBy, orderType }: OrderProps): Order {
    return new Order(new OrderBy(orderBy), OrderType.fromValue(orderType));
  }

  static desc(orderBy: string): Order {
    return new Order(new OrderBy(orderBy), new OrderType(OrderTypeEnum.DESC));
  }

  static asc(orderBy: string): Order {
    return new Order(new OrderBy(orderBy), new OrderType(OrderTypeEnum.ASC));
  }

  public getOrderBy(): string {
    return this.orderBy.value;
  }

  public getOrderType(): OrderTypeEnum {
    return this.orderType.value;
  }

  public isAsc(): boolean {
    return this.orderType.isAsc();
  }
}
