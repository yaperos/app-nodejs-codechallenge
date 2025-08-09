import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

export const TRANSACTION_ID_MISSING = new RpcException({
  code: status.NOT_FOUND,
  message: 'Transaction id is missing',
});
