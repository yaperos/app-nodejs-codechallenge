package com.tec.yape.antifraud.infrastructure.rest.dto.response;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class TransactionStatusDto {

    String name;

    public TransactionStatusDto(String name) {
        this.name = name;
    }

}
