import { ObjectNotFoundError } from 'src/modules/shared/domain/errors';

export class TestObjectNotFoundError extends ObjectNotFoundError {
  protected readonly objectName = 'TestObject';
}
