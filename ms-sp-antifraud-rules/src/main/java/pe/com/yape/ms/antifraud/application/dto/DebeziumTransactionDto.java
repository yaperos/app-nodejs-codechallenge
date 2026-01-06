package pe.com.yape.ms.antifraud.application.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO para deserializar eventos CDC de Debezium en formato JSON.
 * @author lmarusic
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record DebeziumTransactionDto(
    @JsonProperty("transaction_external_id")
    String transactionExternalId,
    
    @JsonProperty("account_external_id_debit")
    String accountExternalIdDebit,
    
    @JsonProperty("account_external_id_credit")
    String accountExternalIdCredit,
    
    @JsonProperty("transfer_type_id")
    Integer transferTypeId,
    
    @JsonProperty("value")
    Double value,
    
    @JsonProperty("status")
    String status,
    
    @JsonProperty("__op")
    String op,
    
    @JsonProperty("__source_ts_ms")
    Long sourceTsMs
) {
}

