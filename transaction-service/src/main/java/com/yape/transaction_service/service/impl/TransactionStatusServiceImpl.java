package com.yape.transaction_service.service.impl;

import com.yape.transaction_service.model.TransactionStatus;
import com.yape.transaction_service.repository.TransactionStatusRepository;
import com.yape.transaction_service.service.TransactionStatusService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class TransactionStatusServiceImpl implements TransactionStatusService  {

    private final TransactionStatusRepository transactionStatusRepository;

    @Override
    public Optional<TransactionStatus> findById(Integer id) {
        return transactionStatusRepository.findById(id);
    }

    @Override
    public Optional<TransactionStatus> findFirstByName(String name) {
        return transactionStatusRepository.findFirstByName(name);
    }

}
