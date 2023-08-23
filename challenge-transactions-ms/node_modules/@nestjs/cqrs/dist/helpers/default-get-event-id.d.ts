import { IEvent } from '../interfaces';
import { Type } from '@nestjs/common';
/**
 * Null if the published class is not connected to any handler
 * @param event
 * @returns
 */
export declare const defaultGetEventId: <EventBase extends IEvent = IEvent>(event: EventBase) => string;
export declare const defaultReflectEventId: <EventBase extends Type<IEvent> = Type<IEvent>>(event: EventBase) => string;
