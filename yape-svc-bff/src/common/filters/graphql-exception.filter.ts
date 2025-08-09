import { Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { Metadata, status } from '@grpc/grpc-js';
import { GraphQLError } from 'graphql/error';

const errorMap = new Map([
  [status.INVALID_ARGUMENT.valueOf(), 'BAD_USER_INPUT'],
  [status.NOT_FOUND.valueOf(), 'NOT_FOUND'],
  [status.ALREADY_EXISTS.valueOf(), 'CONFLICT'],
  [status.FAILED_PRECONDITION.valueOf(), 'PRECONDITION_FAILED'],
  [status.ABORTED.valueOf(), 'CONFLICT'],
  [status.UNAUTHENTICATED.valueOf(), 'UNAUTHENTICATED'],
  [status.PERMISSION_DENIED.valueOf(), 'FORBIDDEN'],
  [status.UNAVAILABLE.valueOf(), 'SERVICE_UNAVAILABLE'],
  [status.DEADLINE_EXCEEDED.valueOf(), 'GATEWAY_TIMEOUT'],
]);

function parseMetadata(meta?: Metadata): Record<string, unknown> {
  if (!meta) return {};

  const out: Record<string, unknown> = {};

  for (const key of meta.getMap ? Object.keys(meta.getMap()) : []) {
    const values = meta.get(key) as Array<string | Buffer>;

    const decoded = values.map((v) => {
      const s = Buffer.isBuffer(v) ? v.toString('utf8') : v;

      try {
        return JSON.parse(s) as object;
      } catch {
        return s;
      }
    });

    out[key] = decoded.length === 1 ? decoded[0] : decoded;
  }

  return out;
}

@Catch()
export class GrpcToGqlExceptionFilter implements GqlExceptionFilter {
  catch(exception: unknown) {
    const safeException = exception as {
      code?: number;
      details?: string;
      message?: string;
      metadata?: Metadata;
    };

    const exceptionCode = safeException?.code || -1;

    const availableCodes = Object.values(status).filter(
      (value) => typeof value === 'number',
    );

    if (!availableCodes.includes(exceptionCode)) {
      throw exception;
    }

    const gqlCode = errorMap.get(exceptionCode) || 'INTERNAL_SERVER_ERROR';
    const msg = safeException.details || safeException.message || 'Error';
    const meta = parseMetadata(safeException.metadata);

    return new GraphQLError(msg, {
      extensions: {
        code: gqlCode,
        grpcCode: exceptionCode,
        grpcStatus: status[exceptionCode],
        meta,
      },
    });
  }
}
