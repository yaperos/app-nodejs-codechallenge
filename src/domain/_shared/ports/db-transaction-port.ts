export abstract class DbTransactionPort {
  abstract startTransaction(shouldKeepAlive?: boolean): Promise<boolean>;
  abstract commitTransaction(): Promise<void>;
  abstract rollbackTransaction(): Promise<void>;
  abstract release(): Promise<void>;
}
