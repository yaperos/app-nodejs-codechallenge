export type EntityWithoutId<T> = Omit<T, 'id'>;
export type EntityWithOptionalId<T> = Omit<T, 'id'> & { id?: number };
export type EntityWithId<T> = Omit<T, 'id'> & { id: number };
export type EntityId<T> = Pick<T extends { id: number } ? T : never, 'id'>;
export type EntityUuId<T> = Pick<T extends { id: string } ? T : never, 'id'>;
export type PickId<T> = T extends { id: number } ? { id: number } : never;
export type Primitive = string | number | boolean | null | undefined;
export type NestedObject = {
  [key: string]: Primitive | Primitive[] | NestedObject | NestedObject[];
};

export type NestedRecord = Record<string, Primitive | Primitive[] | NestedObject | NestedObject[]>;
