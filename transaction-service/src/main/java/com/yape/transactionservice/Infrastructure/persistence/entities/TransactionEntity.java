package com.yape.transactionservice.Infrastructure.persistence.entities;

import com.yape.transactionservice.domain.enums.TransactionStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "transactions")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionEntity {
    @Id
    // @GeneratedValue(strategy = GenerationType.UUID)
    private UUID transactionExternalId;
    @Column(nullable = false)
    private UUID accountExternalIdDebit;
    @Column(nullable = false)
    private UUID accountExternalIdCredit;
    @Column(nullable = false)
    private Integer transferTypeId;
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal value;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus status;
    @Column(nullable = false)
    private LocalDateTime createdAt;
}
