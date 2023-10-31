import { HTTP_CODES } from '../../../shared/imports'
import HttpError from '../http.error'

export default class BadRequestException extends HttpError {
  constructor (description: string) {
    const message: string = 'BadRequestException'
    const status: number = HTTP_CODES.BAD_REQUEST
    super(message, description, status)
  }
}
