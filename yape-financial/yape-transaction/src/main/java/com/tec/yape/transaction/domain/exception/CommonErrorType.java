package com.tec.yape.transaction.domain.exception;

import lombok.Getter;

@Getter
public enum CommonErrorType {

    COMMON_ERROR_400_1("Error in the sorting criteria"),
    COMMON_ERROR_400_2("Invalid request"),
    COMMON_ERROR_400_3("Invalid format for field"),

    COMMON_ERROR_404_1("Record not found");

    private final String description;


    CommonErrorType(String description) {
        this.description = description;
    }
}
