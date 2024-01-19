export interface IBaseRepository<T> {
  create(entity: T): Promise<T>;
  getAll(): Promise<T[]>;
  getById(id?: number): Promise<T>;
  upsert(entity: T): Promise<T>;
  delete(id: number): Promise<void>;
}
