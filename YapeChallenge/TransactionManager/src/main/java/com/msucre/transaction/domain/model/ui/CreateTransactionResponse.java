package com.msucre.transaction.domain.model.ui;

import java.util.UUID;

public record CreateTransactionResponse(String message, UUID transactionId) {

}
