package com.yape.transactionservice.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class TransactionStatus {
    @Id
    private Long id;
    private String name;
}
