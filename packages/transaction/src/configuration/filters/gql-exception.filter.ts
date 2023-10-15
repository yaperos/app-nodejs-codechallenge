import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { GqlExceptionFilter } from "@nestjs/graphql";
import { IGraphqlError } from "./interfaces/error.interface";
import { GraphQLError } from "graphql";

@Catch(HttpException)
export class GqlImplExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const exceptionObject = exception.getResponse() as unknown as IGraphqlError;

    if (exception.getStatus() === HttpStatus.BAD_REQUEST) {
      throw new GraphQLError("Some errors were found in GraphQL input", {
        extensions: {
          validators: exceptionObject.message,
          statusCode: exception.getStatus(),
        },
      });
    }
    throw new GraphQLError(exceptionObject.message as string, {
      extensions: {
        ...exceptionObject,
      },
    });
  }
}
