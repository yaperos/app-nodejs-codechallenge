export abstract class ServiceCommunicationInterface {
  abstract get(url: string): Promise<unknown>;
}
