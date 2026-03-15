package com.challenge.transaction.app.dto;

import lombok.Getter;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class TransactionResponse implements Serializable {

    @Serial
    private static final long serialVersionUID = -5230394309771679808L;

    private UUID transactionExternalId;
    private TypeDto transactionType;
    private StatusDto transactionStatus;
    private Double value;
    private LocalDateTime createdAt;

    @Getter
    @Setter
    public static class StatusDto  implements Serializable {
        @Serial
        private static final long serialVersionUID = 3144852181997944515L;

        private String name;
    }

    @Getter
    @Setter
    public static class TypeDto implements Serializable {
        @Serial
        private static final long serialVersionUID = -5686189229013063853L;

        private String name;
    }
}
