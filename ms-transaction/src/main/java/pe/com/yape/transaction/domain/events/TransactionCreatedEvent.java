package pe.com.yape.transaction.domain.events;

import lombok.Getter;
import pe.com.yape.transaction.domain.model.Transaction;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
public class TransactionCreatedEvent {
    private final UUID transactionExternalId;
    private final UUID accountExternalIdDebit;
    private final UUID accountExternalIdCredit;
    private final Integer transferTypeId;
    private final BigDecimal amount;
    private final LocalDateTime createdAt;

    public TransactionCreatedEvent(Transaction transaction) {
        this.transactionExternalId = transaction.getTransactionExternalId().getValue();
        this.accountExternalIdDebit = transaction.getAccountExternalIdDebit().getValue();
        this.accountExternalIdCredit = transaction.getAccountExternalIdCredit().getValue();
        this.transferTypeId = transaction.getTransferTypeId().getValue();
        this.amount = transaction.getAmount().getValue();
        this.createdAt = transaction.getCreatedAt();
    }
}
