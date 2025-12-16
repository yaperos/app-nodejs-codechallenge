package com.yape.challenge.domain.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Status {
    APPROVED(1, "APPROVED"),
    REJECTED(2, "REJECTED");
    private final int code;
    private final String description;
}
