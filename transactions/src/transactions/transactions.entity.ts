import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transactions {
  @PrimaryGeneratedColumn()
  private id: number;
  @Column()
  private transactionType: string;
  @Column()
  private transactionStatus: string;
  @Column()
  private transactionExternalId: string;
  @Column()
  private value: number;
  @Column()
  private createdAt?: Date;

  constructor(
    transacationType?: string,
    transactionStatus?: string,
    transactionExternalId?: string,
    value?: number,
    createdAt?: Date,
  ) {
    this.transactionType = transacationType;
    this.transactionStatus = transactionStatus;
    this.transactionExternalId = transactionExternalId;
    this.value = value;
    this.createdAt = createdAt;
  }
  public getId(): number {
    return this.id;
  }
  public setId(id: number): void {
    this.id = id;
  }
  public getTransactionType(): string {
    return this.transactionType;
  }
  public setTransactionType(transactionType: string): void {
    this.transactionType = transactionType;
  }
  public getTransactionStatus(): string {
    return this.transactionStatus;
  }
  public setTransactionStatus(transactionStatus: string): void {
    this.transactionStatus = transactionStatus;
  }
  public getTransactionExternalId(): string {
    return this.transactionExternalId;
  }
  public setTransactionExternalId(transactionExternalId: string): void {
    this.transactionExternalId = transactionExternalId;
  }
  public getValue(): number {
    return this.value;
  }
  public setValue(value: number): void {
    this.value = value;
  }
  public getCreatedAt(): Date {
    return this.createdAt;
  }
  public setCreatedAt(createdAt: Date): void {
    this.createdAt = createdAt;
  }
}
