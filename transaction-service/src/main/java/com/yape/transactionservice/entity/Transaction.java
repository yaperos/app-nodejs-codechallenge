package com.yape.transactionservice.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long  transactionExternalId;

    private BigInteger accountExternalIdDebit;

    private BigInteger accountExternalIdCredit;

    @ManyToOne
    @JoinColumn(name = "transfer_type_id")
    private TransactionType transactionType;

    @ManyToOne
    @JoinColumn(name = "status_id")
    private TransactionStatus transactionStatus;


    private Double amount;

    private LocalDateTime createdAt;
}
