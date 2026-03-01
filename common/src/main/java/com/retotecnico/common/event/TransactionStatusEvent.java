package com.retotecnico.common.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionStatusEvent {

    private UUID transactionExternalId;
    private String status; // APPROVED or REJECTED
}
