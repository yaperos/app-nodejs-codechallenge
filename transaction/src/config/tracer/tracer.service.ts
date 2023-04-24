import { Injectable, Scope } from '@nestjs/common';
import { v4 } from 'uuid';

@Injectable({ scope: Scope.REQUEST })
export class TracerService {
  private eventId: string;

  constructor() {
    this.eventId = v4();
  }

  getTrace() {
    return this.eventId;
  }

  setTrace(eventId: string) {
    this.eventId = eventId;
  }
}
