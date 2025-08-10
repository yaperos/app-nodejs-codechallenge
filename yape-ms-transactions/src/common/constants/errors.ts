import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

export const TRANSACTION_TYPE_NOT_FOUND = new RpcException({
  code: status.NOT_FOUND,
  message: 'Transaction type not found',
});

export const TRANSACTION_NOT_FOUND = new RpcException({
  code: status.NOT_FOUND,
  message: 'Transaction not found',
});
