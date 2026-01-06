package pe.com.yape.ms.transaction.application.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO para recibir el evento de transacción validada desde Antifraud
 * @author lmarusic
 */
public record TransactionValidatedEventDto(
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

