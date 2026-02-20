package yape.challenge.transaction_service.adapters.persistence;

import yape.challenge.transaction_service.domain.TransactionStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "transactions", indexes = {
        @Index(name = "idx_tx_external_id", columnList = "transactionExternalId", unique = true)
})
public class TransactionEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String transactionExternalId;

    @Column(nullable = false)
    private String accountExternalIdDebit;

    @Column(nullable = false)
    private String accountExternalIdCredit;

    @Column(nullable = false)
    private Integer transferTypeId;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal value;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus status;

    @Column(nullable = false)
    private Instant createdAt;

    // getters/setters (genera con tu IDE)
    public Long getId() { return id; }
    public String getTransactionExternalId() { return transactionExternalId; }
    public void setTransactionExternalId(String s) { this.transactionExternalId = s; }
    public String getAccountExternalIdDebit() { return accountExternalIdDebit; }
    public void setAccountExternalIdDebit(String s) { this.accountExternalIdDebit = s; }
    public String getAccountExternalIdCredit() { return accountExternalIdCredit; }
    public void setAccountExternalIdCredit(String s) { this.accountExternalIdCredit = s; }
    public Integer getTransferTypeId() { return transferTypeId; }
    public void setTransferTypeId(Integer i) { this.transferTypeId = i; }
    public BigDecimal getValue() { return value; }
    public void setValue(BigDecimal v) { this.value = v; }
    public TransactionStatus getStatus() { return status; }
    public void setStatus(TransactionStatus s) { this.status = s; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant t) { this.createdAt = t; }
}
