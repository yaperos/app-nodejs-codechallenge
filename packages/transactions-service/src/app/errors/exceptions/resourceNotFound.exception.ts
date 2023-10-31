import { HTTP_CODES } from '../../../shared/imports'
import HttpError from '../http.error'

export default class ResourceNotFoundException extends HttpError {
  constructor (description: string) {
    const message: string = 'ResourceNotFoundException'
    const status: number = HTTP_CODES.NOT_FOUND
    super(message, description, status)
  }
}
