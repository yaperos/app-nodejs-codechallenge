/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "transaction";

export interface FilterData {
  field: string;
  operator: string;
  value: string;
}

export interface TransferTypeData {
  id: string;
  name: string;
}

export interface TransactionData {
  id: string;
  transferType: TransferTypeData | undefined;
  validationStatus: string;
  amount: number;
  createdAt: string;
}

export interface TransactionResponse {
  code: number;
  error: string;
  messages: string[];
  data: TransactionData | undefined;
}

/** FindPaginated */
export interface FindPaginatedRequest {
  page: number;
  limit: number;
  orderBy: string;
  order: string;
  filters: FilterData[];
}

export interface PaginatedTransactionsData {
  items: TransactionData[];
  page: number;
  limit: number;
  pages: number;
  total: number;
  filters: FilterData[];
}

export interface PaginatedTransactionsResponse {
  code: number;
  error: string;
  messages: string[];
  data: PaginatedTransactionsData | undefined;
}

/** FindOne */
export interface FindOneRequest {
  id: string;
}

/** Create */
export interface CreateRequest {
  id: string;
  creditAccountExternalId: string;
  debitAccountExternalId: string;
  transferType: string;
  amount: number;
}

export const TRANSACTION_PACKAGE_NAME = "transaction";

export interface TransactionClient {
  findPaginated(request: FindPaginatedRequest): Observable<PaginatedTransactionsResponse>;

  findOne(request: FindOneRequest): Observable<TransactionResponse>;

  create(request: CreateRequest): Observable<TransactionResponse>;
}

export interface TransactionController {
  findPaginated(
    request: FindPaginatedRequest,
  ): Promise<PaginatedTransactionsResponse> | Observable<PaginatedTransactionsResponse> | PaginatedTransactionsResponse;

  findOne(
    request: FindOneRequest,
  ): Promise<TransactionResponse> | Observable<TransactionResponse> | TransactionResponse;

  create(request: CreateRequest): Promise<TransactionResponse> | Observable<TransactionResponse> | TransactionResponse;
}

export function TransactionControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["findPaginated", "findOne", "create"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("Transaction", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("Transaction", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const TRANSACTION_SERVICE_NAME = "Transaction";
