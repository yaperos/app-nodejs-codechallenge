export interface IConsumer {
  connect: () => Promise<void>;
  consume: (message: any) => Promise<void>;
  disconnect: () => Promise<void>;
}
