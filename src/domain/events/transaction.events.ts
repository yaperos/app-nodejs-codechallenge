export interface EventPayload {
  [key: string]: string | number | boolean | Date | Record<string, string | number | boolean> | undefined;
}

export abstract class DomainEvent {
  public readonly eventId: string;
  public readonly occurredAt: Date;
  public readonly aggregateId: string;
  public readonly eventType: string;
  public readonly version: number;

  constructor(aggregateId: string, eventType: string) {
    this.eventId = this.generateEventId();
    this.occurredAt = new Date();
    this.aggregateId = aggregateId;
    this.eventType = eventType;
    this.version = 1;
  }

  private generateEventId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  abstract getPayload(): EventPayload;

  toJSON(): Record<string, unknown> {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      aggregateId: this.aggregateId,
      occurredAt: this.occurredAt.toISOString(),
      version: this.version,
      payload: this.getPayload(),
    };
  }
}

export class TransactionCreatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly transactionId: string,
    public readonly externalId: string,
    public readonly type: string,
    public readonly amount: number,
    public readonly currency: string,
    public readonly sourceAccountId: string,
    public readonly targetAccountId: string,
    public readonly metadata: Record<string, string | number | boolean>,
  ) {
    super(aggregateId, 'TransactionCreated');
  }

  getPayload(): EventPayload {
    return {
      transactionId: this.transactionId,
      externalId: this.externalId,
      type: this.type,
      amount: this.amount,
      currency: this.currency,
      sourceAccountId: this.sourceAccountId,
      targetAccountId: this.targetAccountId,
      metadata: this.metadata,
    };
  }
}

export class TransactionProcessingEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly transactionId: string,
  ) {
    super(aggregateId, 'TransactionProcessing');
  }

  getPayload(): EventPayload {
    return {
      transactionId: this.transactionId,
    };
  }
}

export class TransactionCompletedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly transactionId: string,
    public readonly completedAt: Date,
  ) {
    super(aggregateId, 'TransactionCompleted');
  }

  getPayload(): EventPayload {
    return {
      transactionId: this.transactionId,
      completedAt: this.completedAt.toISOString(),
    };
  }
}

export class TransactionFailedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly transactionId: string,
    public readonly failureReason: string,
  ) {
    super(aggregateId, 'TransactionFailed');
  }

  getPayload(): EventPayload {
    return {
      transactionId: this.transactionId,
      failureReason: this.failureReason,
    };
  }
}

export class TransactionRejectedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly transactionId: string,
    public readonly rejectionReason: string,
    public readonly antifraudScore?: number,
  ) {
    super(aggregateId, 'TransactionRejected');
  }

  getPayload(): EventPayload {
    return {
      transactionId: this.transactionId,
      rejectionReason: this.rejectionReason,
      antifraudScore: this.antifraudScore,
    };
  }
}

export class TransactionReversedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly transactionId: string,
    public readonly reversalTransactionId: string,
    public readonly reversedAt: Date,
  ) {
    super(aggregateId, 'TransactionReversed');
  }

  getPayload(): EventPayload {
    return {
      transactionId: this.transactionId,
      reversalTransactionId: this.reversalTransactionId,
      reversedAt: this.reversedAt.toISOString(),
    };
  }
}

export class AntifraudCheckRequestedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly transactionId: string,
    public readonly amount: number,
    public readonly sourceAccountId: string,
    public readonly targetAccountId: string,
  ) {
    super(aggregateId, 'AntifraudCheckRequested');
  }

  getPayload(): EventPayload {
    return {
      transactionId: this.transactionId,
      amount: this.amount,
      sourceAccountId: this.sourceAccountId,
      targetAccountId: this.targetAccountId,
    };
  }
}

export class AntifraudCheckCompletedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly transactionId: string,
    public readonly score: number,
    public readonly status: string,
  ) {
    super(aggregateId, 'AntifraudCheckCompleted');
  }

  getPayload(): EventPayload {
    return {
      transactionId: this.transactionId,
      score: this.score,
      status: this.status,
    };
  }
}