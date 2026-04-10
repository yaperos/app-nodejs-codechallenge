export interface BaseEvent<TPayload> {
  eventId: string;
  eventType: string;
  eventVersion: number;
  occurredAt: string;
  correlationId: string;
  causationId?: string;
  aggregateId: string;
  aggregateType: 'payment';
  country: string;
  payload: TPayload;
}

export interface PaymentCreatedPayload {
  paymentId: string;
  userId: string;
  amount: number;
  currency: string;
  country: string;
  createdAt: string;
}

export interface PaymentFraudReviewedPayload {
  paymentId: string;
  approved: boolean;
  riskScore: number;
  reason?: string;
}

export interface PaymentLedgerWrittenPayload {
  paymentId: string;
  ledgerEntryId: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  currency: string;
}

export interface PaymentSettledPayload {
  paymentId: string;
  settledAt: string;
}

export interface PaymentFailedPayload {
  paymentId: string;
  failedAt: string;
  source: string;
  reason: string;
  retryable: boolean;
}
