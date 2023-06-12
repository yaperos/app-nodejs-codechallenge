export abstract class ServiceCommunicationInterface {
  abstract get(url: string, params?: unknown): Promise<unknown>;
}
