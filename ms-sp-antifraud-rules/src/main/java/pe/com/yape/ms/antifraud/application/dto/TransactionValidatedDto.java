package pe.com.yape.ms.antifraud.application.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO para el evento de transacción validada (output en JSON)
 * @author lmarusic
 */
public record TransactionValidatedDto(
    @JsonProperty("transaction_external_id")
    String transactionExternalId,
    
    @JsonProperty("validation_status")
    String validationStatus,
    
    @JsonProperty("validation_reason")
    String validationReason,
    
    @JsonProperty("validated_at")
    Long validatedAt,
    
    @JsonProperty("transaction_value")
    Double transactionValue
) {
}

