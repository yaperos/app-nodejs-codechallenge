export interface ICreateRepository<T, U> {
	create(model: T): Promise<U>;
}
