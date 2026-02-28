package com.example.transactionservice.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("transactions")
public class Transaction {
    
    @Id
    private Long id;
    private String transactionId;
    private String accountExternalIdDebit;
    private String accountExternalIdCredit;
    private int transferTypeId;
    private BigDecimal value;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
