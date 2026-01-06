package pe.com.yape.transaction.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import pe.com.yape.transaction.domain.exceptions.InvalidTransactionStateException;
import pe.com.yape.transaction.domain.model.valueObjects.AccountExternalId;
import pe.com.yape.transaction.domain.model.valueObjects.Amount;
import pe.com.yape.transaction.domain.model.valueObjects.TransactionId;
import pe.com.yape.transaction.domain.model.valueObjects.TransferTypeId;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class Transaction {

    private final TransactionId transactionExternalId;
    private final AccountExternalId accountExternalIdDebit;
    private final AccountExternalId accountExternalIdCredit;
    private final TransferTypeId transferTypeId;
    private final Amount amount;
    private TransactionStatus status;
    private final LocalDateTime createdAt;
    private LocalDateTime updatedAt;


    public void approve() {
        this.status = TransactionStatus.APPROVED;
        this.updatedAt = LocalDateTime.now();
    }

    public void reject() {
        this.status = TransactionStatus.REJECTED;
        this.updatedAt = LocalDateTime.now();
    }


    public boolean isPending() {
        return this.status == TransactionStatus.PENDING;
    }


}
