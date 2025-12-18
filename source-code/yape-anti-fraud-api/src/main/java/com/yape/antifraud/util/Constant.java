package com.yape.antifraud.util;

public class Constant {

    public static final String ERROR_INVALID_PAYLOAD = "Invalid payload TransactionCreatedEvent";

    public static final String REASON_UNDER_THRESHOLD = "Amount under threshold";

    public static final String REASON_EXCEEDS_THRESHOLD = "Amount exceeds threshold";

    public static final String MESSAGE_EVENT_ALREADY_PRECESSED =
            "Transaction with external id {} has already been processed. Skipping validation.";

}
