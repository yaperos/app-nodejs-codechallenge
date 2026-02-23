package com.kafka.productor.domain.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransactionType {

    private Long id;
    private String name;

    public TransactionType() {}

    public TransactionType(Long id, String name) {
        this.id = id;
        this.name = name;
    }
}
