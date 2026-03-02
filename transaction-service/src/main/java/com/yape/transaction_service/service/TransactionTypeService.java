package com.yape.transaction_service.service;

import com.yape.transaction_service.model.TransactionType;

import java.util.Optional;

public interface TransactionTypeService {
    Optional<TransactionType> findById(Integer id);
}
