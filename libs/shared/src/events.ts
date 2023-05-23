import { Producer } from "kafkajs";
import { ApiError } from ".";
export const eventAction = ["create", "read", "update", "delete"] as const;
export type EventAction = (typeof eventAction)[number];

export const eventType = ["done", "failed"] as const;
export type EventType = (typeof eventType)[number];

export type EventTopic = `${string}.${EventAction}.${EventType}`;

export type Event<E> =
  | {
      topic: `${string}.${EventAction}.done`;
      source: string;
      action: EventAction;
      type: "done";
      payload: E;
    }
  | {
      topic: `${string}.${EventAction}.failed`;
      source: string;
      action: EventAction;
      type: "failed";
      error: unknown;
    };

export interface EventManagerProps {
  kafkaProducer: Producer;
  microservice: string;
}

export class EventManager {
  constructor(private props: EventManagerProps) {}

  public async register<E>(
    action: EventAction,
    businessLogic: () => Promise<E>
  ): Promise<E> {
    let event: Event<E>;

    try {
      const payload = await businessLogic();

      event = {
        topic: `${this.props.microservice}.${action}.done`,
        source: this.props.microservice,
        action: action,
        type: "done",
        payload: payload,
      };
    } catch (error) {
      event = {
        topic: `${this.props.microservice}.${action}.failed`,
        source: this.props.microservice,
        action: action,
        type: "failed",
        error: ApiError.from(error),
      };
    }

    await this.props.kafkaProducer.connect();
    await this.props.kafkaProducer.send({
      topic: event.topic,
      messages: [{ value: JSON.stringify(event) }],
    });
    await this.props.kafkaProducer.disconnect();

    if (event.type === "done") {
      return event.payload;
    } else {
      throw event.error;
    }
  }

  public async create<E>(businessLogic: () => Promise<E>): Promise<E> {
    return this.register("create", businessLogic);
  }

  public async read<E>(businessLogic: () => Promise<E>): Promise<E> {
    return this.register("read", businessLogic);
  }

  public async update<E>(businessLogic: () => Promise<E>): Promise<E> {
    return this.register("update", businessLogic);
  }

  public async delete<E>(businessLogic: () => Promise<E>): Promise<E> {
    return this.register("delete", businessLogic);
  }
}
