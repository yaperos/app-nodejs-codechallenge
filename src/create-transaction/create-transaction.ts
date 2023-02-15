import uuid = require('uuid');

export class CreateTransaction {
  private accountExternalIdDebit: string;
  private accountExternalIdCredit: string;
  private tranferTypeId: number;
  private value: number;
}
