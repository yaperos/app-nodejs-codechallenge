import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IPageInfo } from '../interfaces/PageInfo';

export function PaginatedOutputBase<T>(classRef: Type<T>): Type<IPageInfo<T>> {
  @ObjectType({ isAbstract: true })
  abstract class Paginated implements IPageInfo<T> {
    @Field(() => [classRef])
    items: T[];

    @Field(() => Int)
    total: number;

    @Field(() => Int)
    count: number;
  }
  return Paginated as Type<IPageInfo<T>>;
}
