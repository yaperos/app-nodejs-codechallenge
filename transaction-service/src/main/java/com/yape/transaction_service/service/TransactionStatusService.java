package com.yape.transaction_service.service;

import com.yape.transaction_service.model.TransactionStatus;

import java.util.Optional;

public interface TransactionStatusService {
    Optional<TransactionStatus> findById(Integer id);
    Optional<TransactionStatus> findFirstByName (String name);
}
