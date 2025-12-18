package com.yape.antifraud.service;


import com.yape.antifraud.entity.TransactionEntity;

import java.util.UUID;

public interface TransactionPersistence {

    TransactionEntity findByTransactionExternalId(UUID transactionExternalId);
}
