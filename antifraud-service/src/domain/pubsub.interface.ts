export abstract class PubsubInterface {
  abstract publish(topic: string, message: unknown);
}
