export interface BrokerRepository {
  send(data: unknown): Promise<unknown>
  receive(): Promise<void>
}
