/**
 * ValidationResult model.
 */
export class ValidationResult {
  transactionId: string;
  isFraudulent: boolean;
  reason?: string;

  constructor(data: Partial<ValidationResult> = {}) {
    this.transactionId = data.transactionId || '';
    this.isFraudulent = data.isFraudulent || false;
    this.reason = data.reason;
  }

  static builder(): ValidationResultBuilder {
    return new ValidationResultBuilder();
  }

  getTransactionId(): string {
    return this.transactionId;
  }

  getIsFraudulent(): boolean {
    return this.isFraudulent;
  }

  getReason(): string | undefined {
    return this.reason;
  }
}

/**
 * Builder class equivalent to Lombok @Builder functionality
 */
export class ValidationResultBuilder {
  private validationResult: Partial<ValidationResult> = {};

  transactionId(transactionId: string): ValidationResultBuilder {
    this.validationResult.transactionId = transactionId;
    return this;
  }

  isFraudulent(isFraudulent: boolean): ValidationResultBuilder {
    this.validationResult.isFraudulent = isFraudulent;
    return this;
  }

  reason(reason: string): ValidationResultBuilder {
    this.validationResult.reason = reason;
    return this;
  }

  build(): ValidationResult {
    return new ValidationResult(this.validationResult);
  }
}
