export interface TransactionRepositoryInterface {
  sendRejected(id: number, message: string): Promise<boolean>;
  sendApproved(id: number, message: string): Promise<boolean>;
}
