export type QueryParams<EntityProps> = Partial<EntityProps>;

export interface IPagination {
  skip?: number;
  take?: number;
}

export interface IFindManyPaginated<EntityProps> {
  params?: QueryParams<EntityProps>;
  pagination?: IPagination;
}
