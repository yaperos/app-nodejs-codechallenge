package pe.com.yape.transaction.infraestructure.adapter.out.persistence.postgresql.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "transactions", indexes = {
        @Index(name = "idx_transaction_external_id", columnList = "transaction_external_id"),
        @Index(name = "idx_transaction_created_at", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor
public class TransactionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transaction_external_id", nullable = false, unique = true)
    private UUID transactionExternalId;

    @Column(name = "account_external_id_debit", nullable = false)
    private UUID accountExternalIdDebit;

    @Column(name = "account_external_id_credit", nullable = false)
    private UUID accountExternalIdCredit;

    @Column(name = "transfer_type_id", nullable = false)
    private Integer transferTypeId;

    @Column(name = "value", nullable = false, precision = 19, scale = 2)
    private BigDecimal value;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
