import { ServerCredentials } from '@grpc/grpc-js';
import { ClientOptions, Transport } from '@nestjs/microservices';

export const grpcClient: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    url: 'localhost:5000',
    credentials: ServerCredentials.createInsecure(),
    package: 'auth',
    protoPath: 'src/auth.proto',
  },
};
