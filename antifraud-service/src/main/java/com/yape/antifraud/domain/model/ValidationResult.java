package com.yape.antifraud.domain.model;

import java.util.UUID;

/**
 * Domain model representing the validation result.
 */
public class ValidationResult {

    private UUID transactionExternalId;
    private ValidationStatus status;
    private String reason;

    public ValidationResult() {
    }

    public ValidationResult(UUID transactionExternalId, ValidationStatus status, String reason) {
        this.transactionExternalId = transactionExternalId;
        this.status = status;
        this.reason = reason;
    }

    public static ValidationResult approved(UUID transactionExternalId) {
        return new ValidationResult(transactionExternalId, ValidationStatus.APPROVED, "Transaction approved");
    }

    public static ValidationResult rejected(UUID transactionExternalId, String reason) {
        return new ValidationResult(transactionExternalId, ValidationStatus.REJECTED, reason);
    }

    public UUID getTransactionExternalId() {
        return transactionExternalId;
    }

    public void setTransactionExternalId(UUID transactionExternalId) {
        this.transactionExternalId = transactionExternalId;
    }

    public ValidationStatus getStatus() {
        return status;
    }

    public void setStatus(ValidationStatus status) {
        this.status = status;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public boolean isApproved() {
        return status == ValidationStatus.APPROVED;
    }
}
