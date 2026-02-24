package pe.yape.transactions.domain.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class Transaction {

    private UUID transactionExternalId;
    private UUID accountExternalIdDebit;
    private UUID accountExternalIdCredit;
    private Integer tranferTypeId;
    private BigDecimal value;

    private TransactionStatus status;
    private Integer antifraudScore;
    private LocalDateTime createdAt;

    public Transaction() {}

    public Transaction(
            UUID transactionExternalId,
            UUID accountExternalIdDebit,
            UUID accountExternalIdCredit,
            Integer tranferTypeId,
            BigDecimal value
    ) {
        this.transactionExternalId = transactionExternalId;
        this.accountExternalIdDebit = accountExternalIdDebit;
        this.accountExternalIdCredit = accountExternalIdCredit;
        this.tranferTypeId = tranferTypeId;
        this.value = value;
        this.status = TransactionStatus.PENDING;
        this.createdAt = LocalDateTime.now();
    }

    public static Transaction newPending(UUID debit, UUID credit, Integer type, BigDecimal value) {
        if (debit == null || credit == null) {
            throw new IllegalArgumentException("Debit and Credit accounts are required");
        }
        if (debit.equals(credit)) {
            throw new IllegalArgumentException("Debit and Credit accounts must be different");
        }
        if (value == null || value.signum() <= 0) {
            throw new IllegalArgumentException("Value must be greater than 0");
        }

        Transaction tx = new Transaction();
        tx.transactionExternalId = UUID.randomUUID();
        tx.accountExternalIdDebit = debit;
        tx.accountExternalIdCredit = credit;
        tx.tranferTypeId = type;
        tx.value = value;
        tx.status = TransactionStatus.PENDING;
        tx.createdAt = LocalDateTime.now();
        return tx;
    }

    public UUID getTransactionExternalId() { return transactionExternalId; }
    public UUID getAccountExternalIdDebit() { return accountExternalIdDebit; }
    public UUID getAccountExternalIdCredit() { return accountExternalIdCredit; }
    public Integer getTranferTypeId() { return tranferTypeId; }
    public BigDecimal getValue() { return value; }
    public TransactionStatus getStatus() { return status; }
    public Integer getAntifraudScore() { return antifraudScore; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public void approve(int score) {
        this.status = TransactionStatus.APPROVED;
        this.antifraudScore = score;
    }

    public void reject(int score) {
        this.status = TransactionStatus.REJECTED;
        this.antifraudScore = score;
    }
}