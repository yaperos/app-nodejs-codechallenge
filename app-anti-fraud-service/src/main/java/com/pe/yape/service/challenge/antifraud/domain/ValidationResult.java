package com.pe.yape.service.challenge.antifraud.domain;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ValidationResult {

    private TransactionStatus transactionStatus;

    private String reasonCode;

}
