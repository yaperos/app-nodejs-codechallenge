import { ServerCredentials } from "@grpc/grpc-js";
import { GrpcOptions, Transport } from "@nestjs/microservices";
import { join } from "path";

export const grpcClientOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    url: "0.0.0.0:3000",
    credentials: ServerCredentials.createInsecure(),
    loader: {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    },
    package: "transaction",
    protoPath: join(__dirname, "./transaction/transaction.proto"),
  },
};
