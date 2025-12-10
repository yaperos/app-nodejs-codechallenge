package com.pe.yape.service.challenge.transactions.exception.handler;

import lombok.Getter;

@Getter
public class ApiException extends RuntimeException {

    private final Integer code;

    public ApiException(Integer code, String message){
        super(message);
        this.code = code;
    }
}
