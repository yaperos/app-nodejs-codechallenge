package com.yape.transaction_service.service.impl;

import com.yape.transaction_service.model.TransactionType;
import com.yape.transaction_service.repository.TransactionTypeRepository;
import com.yape.transaction_service.service.TransactionTypeService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TransactionTypeServiceImpl implements TransactionTypeService {

    private final TransactionTypeRepository transactionTypeRepository;

    public TransactionTypeServiceImpl(TransactionTypeRepository transactionTypeRepository) {
        this.transactionTypeRepository = transactionTypeRepository;
    }

    @Override
    public Optional<TransactionType> findById(Integer id) {
        return transactionTypeRepository.findById(id);
    }
}

