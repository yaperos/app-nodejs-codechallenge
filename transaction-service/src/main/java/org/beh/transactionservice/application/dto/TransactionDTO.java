package org.beh.transactionservice.application.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * GET /api/v1/transactions/{id} response — matches spec exactly:
 *
 * {
 *   "transactionExternalId": "Guid",
 *   "transactionType": { "name": "" },
 *   "transactionStatus": { "name": "" },
 *   "value": 120,
 *   "createdAt": "Date"
 * }
 *
 * Serializable for Redis caching.
 */
@Data
@Builder
public class TransactionDTO implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private UUID transactionExternalId;

    private TransactionTypeDTO transactionType;

    private TransactionStatusDTO transactionStatus;

    private BigDecimal value;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    // ─── Nested DTOs ───────────────────────────────────────────────────────

    @Data
    @Builder
    public static class TransactionTypeDTO implements Serializable {
        @Serial
        private static final long serialVersionUID = 1L;
        private String name;
    }

    @Data
    @Builder
    public static class TransactionStatusDTO implements Serializable {
        @Serial
        private static final long serialVersionUID = 1L;
        private String name;
    }
}

