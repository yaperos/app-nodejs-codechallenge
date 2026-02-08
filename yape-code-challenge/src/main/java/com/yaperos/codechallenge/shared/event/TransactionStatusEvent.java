package com.yaperos.codechallenge.shared.event;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TransactionStatusEvent {

    private UUID transactionExternalId;
    private TransactionStatusType status;

}
