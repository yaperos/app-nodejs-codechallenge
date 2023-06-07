import { Producer } from "kafkajs";
import { Domain } from "../domain/Domain";
import { ErrorFactory } from "../exception/ErrorFactory";
import { EventAction, EventMetadata, EventType } from "./EventDomain";

export interface EventManagerProps {
  microservice: string;
  kafkaProducer: Producer;
}

export class EventManager {
  constructor(private props: EventManagerProps) {}

  async resourceRequest<T extends Domain>(
    props: { businessLogic: () => Promise<T> } & Partial<EventMetadata>
  ) {
    let data: T;
    try {
      data = await props.businessLogic();
      await this.emitEvent(
        `${this.props.microservice}${
          props.namespace ? `.${props.namespace}` : ""
        }.${EventAction.REQUEST}.${EventType.DONE}`,
        data
      );
    } catch (error) {
      await this.emitEvent(
        `${this.props.microservice}.${
          props.namespace ? `.${props.namespace}` : ""
        }.${EventAction.REQUEST}.${EventType.FAILED}`,
        error
      );
      throw error;
    }
    return data;
  }

  async resourceCreate<T extends Domain>(
    props: {
      businessLogic: () => Promise<T>;
    } & Partial<EventMetadata>
  ) {
    let data: T;
    try {
      data = await props.businessLogic();
      await this.emitEvent(
        `${this.props.microservice}${
          props.namespace ? `.${props.namespace}` : ""
        }.${EventAction.CREATE}.${EventType.DONE}`,
        data
      );
    } catch (error) {
      await this.emitEvent(
        `${this.props.microservice}.${
          props.namespace ? `.${props.namespace}` : ""
        }.${EventAction.CREATE}.${EventType.FAILED}`,
        error
      );
      throw error;
    }
    return data;
  }

  async resourceUpdate<T extends Domain>(
    props: {
      businessLogic: () => Promise<T>;
    } & Partial<EventMetadata>
  ): Promise<T> {
    let data: T;
    try {
      data = await props.businessLogic();
      await this.emitDoneEvent(
        `${this.props.microservice}${
          props.namespace ? `.${props.namespace}` : ""
        }.${EventAction.UPDATE}.${EventType.DONE}`,
        data
      );
    } catch (error) {
      await this.emitFailedEvent(
        `${this.props.microservice}.${
          props?.namespace ? `.${props.namespace}` : ""
        }.${EventAction.UPDATE}.${EventType.FAILED}`,
        error
      );
      throw error;
    }
    return data;
  }

  async emitDoneEvent<T extends Domain>(topic: string, data: T) {
    await this.emitEvent(topic, data.getEventData());
  }

  async emitFailedEvent(topic: string, error: unknown) {
    const e = ErrorFactory.create(error);
    await this.emitEvent(topic, e.getEventData());
  }

  async emitEvent(topic: string, data: unknown) {
    await this.props.kafkaProducer.connect();
    await this.props.kafkaProducer.send({
      topic: topic,
      messages: [{ value: JSON.stringify(data) }],
    });
    await this.props.kafkaProducer.disconnect();
  }
}
