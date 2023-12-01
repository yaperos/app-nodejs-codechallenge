export abstract class EventBase {
  abstract TOPIC: string;

  toString(): string {
    const excluteTopic = JSON.parse(JSON.stringify(this));
    delete excluteTopic.TOPIC;

    return JSON.stringify(excluteTopic);
  }
}
