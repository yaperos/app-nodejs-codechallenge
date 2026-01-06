package com.desafio.yape.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "transaction")
@Getter
@Setter
@NoArgsConstructor
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String transactionExternalId;

    @Column(nullable = false)
    private String accountExternalIdDebit;

    @Column(nullable = false)
    private String accountExternalIdCredit;

    private Integer transferTypeId;

    @Column(name = "amount")
    private Double amount;

    @ManyToOne
    @JoinColumn(name = "transaction_status_id")
    private TransactionStatus transactionStatus;

    @ManyToOne
    @JoinColumn(name = "transaction_type_id")
    private TransactionType transactionType;

    private LocalDateTime createdAt = LocalDateTime.now();
}
