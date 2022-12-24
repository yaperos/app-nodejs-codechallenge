/* eslint-disable @typescript-eslint/no-explicit-any */
export interface TransactionRepository {
  create(data: any): Promise<any>
  get(id: string): Promise<any>
}
