import { ApiProperty } from '@nestjs/swagger';

export default class Transaction {
  @ApiProperty({ format: 'uuid' })
  transactionId: string;

  @ApiProperty({ format: 'uuid' })
  accountExternalIdDebit: string;

  @ApiProperty({ format: 'uuid' })
  accountExternalIdCredit: string;

  @ApiProperty()
  tranferTypeId: number;

  @ApiProperty()
  value: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdAt: Date;

  constructor(params: Partial<Transaction>) {
    Object.assign(this, params);
  }

  public getTransactionId(): string {
    return this.transactionId;
  }

  public getValue(): number {
    return this.value;
  }

  public getAccountExternalIdDebit(): string {
    return this.accountExternalIdDebit;
  }

  public getAccountExternalIdCredit(): string {
    return this.accountExternalIdCredit;
  }

  public getTranferTypeId(): number {
    return this.tranferTypeId;
  }

  public getStatus(): string {
    return this.status;
  }

  public setStatus(status: string) {
    this.status = status;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }
}
