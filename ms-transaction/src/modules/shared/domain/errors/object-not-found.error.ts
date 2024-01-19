export abstract class ObjectNotFoundError extends Error {
  protected abstract objectName: string;

  public get message(): string {
    return `${this.objectName} not found`;
  }
}
