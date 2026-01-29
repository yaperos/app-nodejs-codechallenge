package com.tec.yape.antifraud.domain.exception;

import lombok.Getter;

@Getter
public enum CommonErrorType {

    COMMON_ERROR_400_1("Error en el criterio de ordenación");

    private final String description;


    CommonErrorType(String description) {
        this.description = description;
    }
}
