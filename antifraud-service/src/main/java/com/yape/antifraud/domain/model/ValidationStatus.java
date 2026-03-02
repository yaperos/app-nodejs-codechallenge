package com.yape.antifraud.domain.model;

public enum ValidationStatus {
    APPROVED("approved"),
    REJECTED("rejected");

    private final String name;

    ValidationStatus(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
