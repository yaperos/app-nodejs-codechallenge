import { ModuleRef } from '@nestjs/core';
import {
  CommandBus,
  EventBus,
  IEvent,
  UnhandledExceptionBus,
} from '@nestjs/cqrs';
import { DomainEvent } from 'src/modules/shared/domain/domain-event';

export class MockEventBus extends EventBus {
  private mockPublish = jest.fn();
  private mockPublishAll = jest.fn();

  constructor() {
    const commandBus: Partial<CommandBus> = {};
    const moduleRef: Partial<ModuleRef> = {};
    const unhandledExceptionBus: Partial<UnhandledExceptionBus> = {};
    super(
      commandBus as CommandBus,
      moduleRef as ModuleRef,
      unhandledExceptionBus as UnhandledExceptionBus,
    );
  }

  async publish(event: Event): Promise<void> {
    this.mockPublish(event);
  }

  async assertPublishHasBeenCalledWith(event: DomainEvent<any>) {
    expect(this.mockPublish).toHaveBeenCalledWith(event);
  }
}

type Event = DomainEvent<any> | IEvent;
