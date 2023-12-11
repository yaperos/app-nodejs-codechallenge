import { EventType } from 'src/enum/event-type';

export interface Event {
  type: EventType;
  params: any;
}
