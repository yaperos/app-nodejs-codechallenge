package com.tec.yape.antifraud.infrastructure.rest.dto.response;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class TransactionTypeDto {

    String name;

    public TransactionTypeDto(String name) {
        this.name = name;
    }

}
