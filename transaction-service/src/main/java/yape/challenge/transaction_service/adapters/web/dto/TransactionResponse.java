package yape.challenge.transaction_service.adapters.web.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.time.Instant;

public record TransactionResponse(
        @JsonProperty("transactionExternalId") String transactionExternalId,
        @JsonProperty("transactionType") NamedObject transactionType,
        @JsonProperty("transactionStatus") NamedObject transactionStatus,
        @JsonProperty("value") BigDecimal value,
        @JsonProperty("createdAt") Instant createdAt
) {}