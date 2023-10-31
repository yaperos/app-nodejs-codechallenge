import { describe, expect, test } from '@jest/globals'
import { GraphQLError } from 'graphql'
import HttpError from '../../../app/errors/http.error'
import graphqlErrorHandler from '../../../server/error/grapqhlErrorHandler'
import ResourceNotFoundException from '../../../app/errors/exceptions/resourceNotFound.exception'
import { HTTP_CODES } from '../../../shared/imports'
import BadRequestException from '../../../app/errors/exceptions/badRequest.exception'

describe('Common cases for error Graphql error handling', () => {
  test('should throw a GraphQLError with the error description, message and status code when given a HttpError', () => {
    const error = new HttpError('Test Error', 'Test Description', 500)
    expect(() => { graphqlErrorHandler(error) }).toThrow(GraphQLError)
    try {
      graphqlErrorHandler(error)
    } catch (err: any) {
      expect(err.message).toBe('Test Description')
      expect(err.extensions.code).toBe('Test Error')
      expect(err.extensions.http.status).toBe(500)
    }
  })
  test('should throw a GraphQLError with the error code and NOT_FOUND status when given a ResourceNotFoundException', () => {
    const error = new ResourceNotFoundException('Test Error')
    expect(() => { graphqlErrorHandler(error) }).toThrow(GraphQLError)
    try {
      graphqlErrorHandler(error)
    } catch (err: any) {
      expect(err.extensions.code).toBe('ResourceNotFoundException')
      expect(err.extensions.http.status).toBe(HTTP_CODES.NOT_FOUND)
    }
  })
  test('should throw a GraphQLError with the error code and BAD_REQUEST status when given a BadRequestException', () => {
    const error = new BadRequestException('Test Error')
    expect(() => { graphqlErrorHandler(error) }).toThrow(GraphQLError)
    try {
      graphqlErrorHandler(error)
    } catch (err: any) {
      expect(err.extensions.code).toBe('BadRequestException')
      expect(err.extensions.http.status).toBe(HTTP_CODES.BAD_REQUEST)
    }
  })
})
