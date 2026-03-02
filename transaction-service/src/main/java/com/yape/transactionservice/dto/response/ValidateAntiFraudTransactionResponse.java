package com.yape.transactionservice.dto.response;

import com.yape.transactionservice.entity.Transaction;
import lombok.Data;

@Data
public class ValidateAntiFraudTransactionResponse {

    private boolean success;
    private Transaction transaction;

}
