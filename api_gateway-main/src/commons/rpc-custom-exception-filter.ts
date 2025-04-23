import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export interface ErrorRPC {
  statusCode: number;
  message: string;
  onMicroservice?: string;
}

@Catch(RpcException)
export class CustomRpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();

    const rpcError = exception.getError() as ErrorRPC | string;

    if (rpcError.toString().includes('Empty response')) {
      return response.status(500).json({
        statusCode: 500,
        message: rpcError
          .toString()
          .substring(0, rpcError.toString().indexOf('(') - 1),
      });
    }

    if (
      typeof rpcError === 'object' &&
      'statusCode' in rpcError &&
      'message' in rpcError &&
      'onMicroservice' in rpcError
    ) {
      return response.status(rpcError.statusCode).json({
        statusCode: rpcError.statusCode,
        message: rpcError.message,
        onMicroservice: rpcError.onMicroservice,
      });
    }

    return response.status(500).json({ message: `Error general: ${rpcError}` });
  }
}
