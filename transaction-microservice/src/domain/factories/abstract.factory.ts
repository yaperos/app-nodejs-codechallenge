export abstract class AbstractFactory<T> {
  abstract make(input?: unknown): Promise<T>;
}
