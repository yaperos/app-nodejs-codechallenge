export class TransactionTypesUtility {
  private transferTypes: [string, string] = ['DEBIT', 'CREDIT'];

  public getTransactionTypeName(tranferTypeId: number): string {
    return this.transferTypes[tranferTypeId - 1];
  }
}
