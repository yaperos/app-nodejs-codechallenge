import { v4 as uuidv4 } from 'uuid';

export abstract class DomainEvent {
  static EVENT_NAME: string;
  readonly key: string;
  readonly partition: number;
  readonly timestamp: string;
  readonly event_name: string;
  readonly message: any;

  constructor(
    params: { 
      event_name: string; 
      group_id?: string; 
      key?: string; 
      partition?: number; 
      timestamp?: string;
      message: any;
    }) {
    const { event_name, key, partition, timestamp, message } = params;
    this.key = key || uuidv4();
    this.partition = partition;
    this.timestamp = timestamp;
    this.event_name = event_name;
    this.message = message;
  }

}

type DomainEventValues = Record<string, any>;

export type Event = { key?: string; partition?: number; timestamp?: string; group_id?: string; message: any;};
