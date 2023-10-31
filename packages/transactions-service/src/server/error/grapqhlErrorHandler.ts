import { GraphQLError } from 'graphql'
import HttpError from '../../app/errors/http.error'
import ErrorMessagesConstants from '../../shared/constants/errorMessages.constants'
import { HTTP_CODES } from '../../shared/imports'

export default function graphqlErrorHandler (err: Error): void {
  const { description, message, status }: { description: string, message: string, status: number } = err instanceof HttpError
    ? { description: err.description, message: err.message, status: err.status }
    : { description: ErrorMessagesConstants.COMMON.UNKNOWN, message: err.message, status: HTTP_CODES.SERVER_ERROR }
  throw new GraphQLError(description, {
    extensions: {
      code: message,
      http: {
        status
      }
    }
  })
}
