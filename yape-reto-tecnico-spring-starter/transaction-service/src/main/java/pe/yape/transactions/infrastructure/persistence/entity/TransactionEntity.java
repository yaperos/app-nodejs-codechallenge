package pe.yape.transactions.infrastructure.persistence.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;
import pe.yape.transactions.domain.model.TransactionStatus;

@Entity
@Table(
        name = "transactions",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_transactions_transaction_external_id", columnNames = "transaction_external_id")
        }
)
@Getter
@Setter
public class TransactionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transaction_external_id", nullable = false, updatable = false)
    private UUID transactionExternalId;

    @Column(name = "account_external_id_debit", nullable = false)
    private UUID accountExternalIdDebit;

    @Column(name = "account_external_id_credit", nullable = false)
    private UUID accountExternalIdCredit;

    @Column(name = "transfer_type_id", nullable = false)
    private Integer tranferTypeId;

    @Column(name = "value", nullable = false, precision = 19, scale = 2)
    private BigDecimal value;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TransactionStatus status;

    @Column(name = "antifraud_score")
    private Integer antifraudScore;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public TransactionEntity() {}

    public static TransactionEntity newPending(UUID debit, UUID credit, Integer tranferTypeId, BigDecimal value) {
        TransactionEntity e = new TransactionEntity();
        e.transactionExternalId = UUID.randomUUID();
        e.accountExternalIdDebit = debit;
        e.accountExternalIdCredit = credit;
        e.tranferTypeId = tranferTypeId;
        e.value = value;
        e.status = TransactionStatus.PENDING;
        e.createdAt = LocalDateTime.now();
        return e;
    }

    public Long getId() { return id; }
    public UUID getTransactionExternalId() { return transactionExternalId; }
    public UUID getAccountExternalIdDebit() { return accountExternalIdDebit; }
    public UUID getAccountExternalIdCredit() { return accountExternalIdCredit; }
    public Integer getTranferTypeId() { return tranferTypeId; }
    public BigDecimal getValue() { return value; }
    public TransactionStatus getStatus() { return status; }
    public Integer getAntifraudScore() { return antifraudScore; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void approve(int score) {
        this.status = TransactionStatus.APPROVED;
        this.antifraudScore = score;
    }

    public void reject(int score) {
        this.status = TransactionStatus.REJECTED;
        this.antifraudScore = score;
    }
}