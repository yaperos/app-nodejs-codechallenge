enum transferTypesAllowed {
  DEBIT,
  CREDIT,
}
export class TransactionTypesUtility {
  private transferTypes: [string, string] = ['DEBIT', 'CREDIT'];

  public getTransactionTypeName(tranferTypeId: number): string {
    const transferType: string = this.transferTypes[tranferTypeId - 1];
    if (!transferTypesAllowed[transferType]) {
      throw new ReferenceError(`tranferTypeId "${tranferTypeId}" not allowed`);
    }
    return transferType;
  }
}
