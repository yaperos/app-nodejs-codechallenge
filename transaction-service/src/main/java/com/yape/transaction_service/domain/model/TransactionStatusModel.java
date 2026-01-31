package com.yape.transaction_service.domain.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("transaction_status")
public class TransactionStatusModel {

    @Id
    private Long id;

    private String name;

}
