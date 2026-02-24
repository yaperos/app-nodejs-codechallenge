package org.beh.antifraudservice.dto;

import lombok.Data;

import java.math.BigDecimal;

/**
 * Mirrors the outbox payload produced by the transaction service:
 * {
 *   "transactionId": "uuid",
 *   "accountExternalIdDebit": "uuid",
 *   "accountExternalIdCredit": "uuid",
 *   "transferTypeId": 1,
 *   "value": 120,          <- matches the domain field name
 *   "status": "PENDING"
 * }
 *
 * Field names must align exactly with the Kafka JSON payload.
 */
@Data
public class TransactionEvent {
    private String transactionId;
    private String accountExternalIdDebit;
    private String accountExternalIdCredit;
    private Integer transferTypeId;
    private BigDecimal value;   // was "amount" — renamed to match transaction service contract
    private String status;
}
