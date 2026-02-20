package yape.challenge.common.events;

import java.math.BigDecimal;
import java.time.Instant;

public class TransactionCreatedEvent {
    public String transactionExternalId;
    public String accountExternalIdDebit;
    public String accountExternalIdCredit;
    public Integer transferTypeId;
    public BigDecimal value;
    public Instant createdAt;
}