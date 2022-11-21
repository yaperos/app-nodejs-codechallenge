import { ApplicationError } from '../../../../Shared/domain/ApplicationError';

export class WrongTransferType extends ApplicationError {
  constructor() {
    super('Tipo de transferencia incorrecta', 'BAD_REQUEST');
  }
}
