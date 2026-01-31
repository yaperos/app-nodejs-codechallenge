package com.yape.transaction_service.domain.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("transaction_type")
public class TransactionTypeModel {

    @Id
    private Long id;

    private String name;

}
