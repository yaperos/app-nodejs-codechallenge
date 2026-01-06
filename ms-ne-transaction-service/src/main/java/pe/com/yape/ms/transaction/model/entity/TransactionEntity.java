package pe.com.yape.ms.transaction.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import pe.com.yape.ms.transaction.model.domain.Transaction;
import pe.com.yape.ms.transaction.model.domain.TransactionStatus;
import pe.com.yape.ms.transaction.model.domain.TransactionType;

/**
 * Entidad JPA para persistencia de transacciones
 *
 * @author lmarusic
 * @version 1.0.0
 */
@Entity
@Table(name = "transactions")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
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
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private TransactionStatus status;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    /**
     * Convierte esta entidad a un objeto de dominio
     */
    public Transaction toDomain() {
        return new Transaction(
            this.transactionExternalId,
            this.accountExternalIdDebit,
            this.accountExternalIdCredit,
            TransactionType.fromId(this.transferTypeId),
            this.value,
            this.status,
            this.createdAt,
            this.updatedAt
        );
    }
    
    /**
     * Crea una entidad desde un objeto de dominio
     */
    public static TransactionEntity fromDomain(Transaction transaction) {
        TransactionEntity entity = new TransactionEntity();
        entity.setTransactionExternalId(transaction.transactionExternalId());
        entity.setAccountExternalIdDebit(transaction.accountExternalIdDebit());
        entity.setAccountExternalIdCredit(transaction.accountExternalIdCredit());
        entity.setTransferTypeId(transaction.transactionType().getId());
        entity.setValue(transaction.value());
        entity.setStatus(transaction.status());
        entity.setCreatedAt(transaction.createdAt());
        entity.setUpdatedAt(transaction.updatedAt());
        return entity;
    }
}

