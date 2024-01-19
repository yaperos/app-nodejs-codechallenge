import { CriteriaWithId } from 'src/modules/shared/domain/criteria/criteria-with-id';
import { FilterProps } from 'src/modules/shared/domain/criteria/filter';
import { Order } from 'src/modules/shared/domain/criteria/order';
import { OrderTypeEnum } from 'src/modules/shared/domain/criteria/order-type';

export class TransactionCriteria extends CriteriaWithId {
  public static fromRequestValues({
    filters = [],
    orderBy = 'createdAt',
    order = OrderTypeEnum.DESC,
    page,
    limit,
  }: {
    filters?: Array<FilterProps>;
    orderBy?: string;
    order?: string;
    page?: number;
    limit?: number;
  }): TransactionCriteria {
    const criteria = new this()
      .setFiltersByValues(filters)
      .ordering(Order.fromValues({ orderBy, orderType: order }))
      .paginateByDefault(page, limit);

    return criteria;
  }
}
