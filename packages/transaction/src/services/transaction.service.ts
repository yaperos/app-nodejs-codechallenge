import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Observable, catchError, from, map, switchMap, tap } from "rxjs";
import { CreateTransactionEmitter } from "../emitter/create-transaction.emitter";

import { Status } from "../enums/status.enum";
import { TransactionType } from "../enums/transaction-type.enum";
import { Repository } from "typeorm";
import { Transaction as TransactionEntity } from "../entities/transaction.entity";
import { Transaction as TransactionObject } from "../objects/transaction";

import { ExceptionCodes } from "../enums/exception-code.enum";
import { TransactionNotFoundException } from "../configuration/filters/exceptions/transaction-not-found.exception";
import { TransactionTruncatedException } from "../configuration/filters/exceptions/transaction-truncated.exception";
import { CreateTransactionInput } from "../objects/inputs/create-transaction.input";
import { OrmTransactionException } from "../configuration/filters/exceptions/orm-transaction.exception";

@Injectable()
export class TransactionService {
  constructor(
    @Inject("TRANSACTION_REPOSITORY")
    private readonly transactionRepository: Repository<TransactionEntity>,
    private readonly transactionEmitter: CreateTransactionEmitter
  ) {}

  findById(id: string): Observable<TransactionObject> {
    return from(
      this.transactionRepository.findOne({
        where: {
          id,
        },
      })
    ).pipe(
      catchError((err) => {
        throw new OrmTransactionException({
          id,
          message: err?.message || `Something went wrong with the operation`,
          status: HttpStatus.CONFLICT,
        });
      }),
      tap((result) => {
        if (!result) {
          throw new TransactionNotFoundException({
            id,
            message: `Transaction ${id} was not found`,
            code: ExceptionCodes.TX_NOT_FOUND,
            status: HttpStatus.NOT_FOUND,
          });
        }
      }),
      map(({ id, status, value, createdAt, type, updatedAt }) => ({
        transactionExternalId: id,
        createdAt: createdAt.toISOString(),
        value,
        transactionStatus: {
          name: status,
        },
        transactionType: {
          name: type,
        },
        updatedAt: updatedAt.toISOString(),
      }))
    );
  }

  save({
    accountExternalIdCredit,
    accountExternalIdDebit,
    transferTypeId,
    value,
  }: CreateTransactionInput): Observable<TransactionObject> {
    return from(
      this.transactionRepository.save({
        accountExternalIdCredit,
        accountExternalIdDebit,
        value,
        type:
          transferTypeId === 1 ? TransactionType.CREDIT : TransactionType.DEBIT,
        status: Status.PENDING,
      })
    ).pipe(
      catchError((err) => {
        throw new TransactionTruncatedException({
          message:
            err?.message ||
            `Something went wrong during the creation of the transaction`,
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          code: ExceptionCodes.TX_NOT_SAVED,
        });
      }),
      map(({ id, status, value, createdAt, type, updatedAt }) => ({
        transactionExternalId: id,
        createdAt: createdAt.toISOString(),
        value,
        transactionStatus: {
          name: status,
        },
        transactionType: {
          name: type,
        },
        updatedAt: updatedAt.toISOString(),
      })),
      tap(({ transactionExternalId, value }) => {
        this.transactionEmitter
          .createTransactionEmitter({
            id: transactionExternalId,
            value,
          })
          .subscribe();
      })
    );
  }

  update(id: string, status: string): Observable<TransactionEntity> {
    return from(
      this.transactionRepository.findOne({
        where: {
          id,
        },
      })
    ).pipe(
      tap((result) => {
        if (!result) {
          throw new TransactionNotFoundException({
            id,
            message: `Transaction ${id} was not found`,
            code: ExceptionCodes.TX_NOT_FOUND,
            status: HttpStatus.NOT_FOUND,
          });
        }
      }),
      switchMap((transaction) => {
        return from(
          this.transactionRepository.save({
            ...transaction,
            status,
          })
        );
      })
    );
  }
}
