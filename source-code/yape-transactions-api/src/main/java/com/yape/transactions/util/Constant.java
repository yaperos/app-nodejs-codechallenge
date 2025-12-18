package com.yape.transactions.util;

public class Constant {

    public static final String ERROR_INVALID_PAYLOAD = "Invalid payload TransactionValidatedEvent";

    public static final String MESSAGE_NOT_EXIST_TRANSACTION = "Transaction with external id {} does not exist.";

    public static final String MESSAGE_EVENT_ALREADY_PRECESSED =
            "Transaction with external id {} has already been processed. Skipping validation.";

}
