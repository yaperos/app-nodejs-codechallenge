import { Type } from 'class-transformer';
import { Order } from '../../config/constants';

export class PageOptionsDto {
  readonly order?: Order = Order.ASC;

  @Type(() => Number)
  readonly page?: number = 1;

  @Type(() => Number)
  readonly take?: number = 10;

  readonly skip?: number = 0;
}
