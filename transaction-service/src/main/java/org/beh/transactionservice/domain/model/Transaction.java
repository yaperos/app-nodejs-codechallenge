package org.beh.transactionservice.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "transactions", indexes = {
    @Index(name = "idx_transaction_status", columnList = "status"),
    @Index(name = "idx_transaction_created_at", columnList = "created_at"),
    @Index(name = "idx_transaction_debit", columnList = "account_external_id_debit"),
    @Index(name = "idx_transaction_credit", columnList = "account_external_id_credit")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal value;

    @Column(name = "account_external_id_debit", nullable = false)
    private UUID accountExternalIdDebit;

    @Column(name = "account_external_id_credit", nullable = false)
    private UUID accountExternalIdCredit;

    /**
     * ManyToOne to TransactionType — gives us the "name" field
     * the GET response needs: transactionType: { name: "" }
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "transfer_type_id", nullable = false)
    private TransactionType transactionType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TransactionStatus status;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * Optimistic locking — JPA increments this on every UPDATE.
     * If two threads load version=1 and both try to save, the second
     * will get ObjectOptimisticLockingFailureException — no silent lost update.
     */
    @Version
    private Long version;

    // ─── Domain Behaviour ──────────────────────────────────────────────────

    public void approve() {
        ensurePending();
        this.status = TransactionStatus.APPROVED;
    }

    public void reject() {
        ensurePending();
        this.status = TransactionStatus.REJECTED;
    }

    private void ensurePending() {
        if (this.status != TransactionStatus.PENDING) {
            throw new IllegalStateException(
                "Status transition not allowed. Transaction %s is already %s"
                    .formatted(this.id, this.status)
            );
        }
    }
}
