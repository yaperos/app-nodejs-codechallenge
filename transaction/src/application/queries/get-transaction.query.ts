import { AggregateRoot } from '@nestjs/cqrs';
import { TransactionStatus } from '../../core/contants';

// Definición de tipos para los atributos de la transacción
export type TransactionEssential = {
  readonly accountExternalIdDebit: string;
  readonly accountExternalIdCredit: string;
  readonly tranferTypeId: number;
  readonly value: number;
};

export type TransactionOptional = {
  readonly transactionExternalId: string;
  readonly status: number;
};

// Tipo que combina los atributos esenciales y opcionales de la transacción
export type TransactionProperties = Required<TransactionEssential> &
  Partial<TransactionOptional>;

// Definición de la clase Transaction
export class Transaction extends AggregateRoot {
  private readonly transactionExternalId: string;
  private readonly accountExternalIdDebit: string;
  private readonly accountExternalIdCredit: string;
  private readonly tranferTypeId: number;
  private readonly value: number;
  private readonly status: number;

  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(properties: TransactionProperties) {
    super();
    Object.assign(this, properties);
    this.createdAt = new Date();
    this.status = properties.transactionExternalId
      ? properties.status
      : TransactionStatus.PENDING;
  }

  // Método para obtener los atributos de la transacción
  properties() {
    return {
      transactionExternalId: this.transactionExternalId,
      accountExternalIdDebit: this.accountExternalIdDebit,
      accountExternalIdCredit: this.accountExternalIdCredit,
      tranferTypeId: this.tranferTypeId,
      value: this.value,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // Método para actualizar los atributos opcionales de la transacción
  update(fields: Partial<TransactionOptional>) {
    Object.assign(this, fields);
    this.updatedAt = new Date();
  }
}