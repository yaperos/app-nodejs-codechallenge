import { status as GrpcStatus } from "@grpc/grpc-js";
import { Logger } from "@nestjs/common";

export abstract class BaseController {
  public notFound(error: Error | string) {
    return this.fail(error, GrpcStatus.NOT_FOUND);
  }

  public fail(error: Error | string, statusCode = GrpcStatus.INTERNAL) {
    Logger.error(error);
    return {
      error: {
        message: error.toString(),
      },
    };
  }

  public ok<T>(dto?: T) {
    if (!!dto) {
      return dto;
    } else {
      return {
        resultMessage: {
          message: "Successfull request",
          statusCode: GrpcStatus.OK.toString(),
        },
      };
    }
  }

  public errorResponse(error: any) {
    switch (error.constructor) {
      default:
        return this.fail(error);
    }
  }
}
