package com.challenge.transaction.app.dto;

import lombok.Getter;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;
import java.util.UUID;

@Getter
@Setter
public class CreateTransactionRequest implements Serializable {

    @Serial
    private static final long serialVersionUID = 3741074636662158145L;

    private UUID accountExternalIdDebit;
    private UUID accountExternalIdCredit;
    private Integer transferTypeId;
    private Double value;
}
