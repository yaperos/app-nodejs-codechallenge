export interface ITransactionRepository {
  findAll: () => Promise<any[]>;
}
