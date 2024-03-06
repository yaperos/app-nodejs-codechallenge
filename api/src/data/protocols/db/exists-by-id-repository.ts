export interface IExistsByIdRepository {
	existsById(id: number): Promise<boolean>;
}
