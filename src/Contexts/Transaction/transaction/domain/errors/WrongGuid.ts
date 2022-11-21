import { ApplicationError } from '../../../../Shared/domain/ApplicationError';

export class WrongGuid extends ApplicationError {
  constructor() {
    super('El campo tiene que ser un guid', 'BAD_REQUEST');
  }
}
