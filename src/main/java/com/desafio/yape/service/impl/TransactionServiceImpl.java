package com.desafio.yape.service.impl;

import com.desafio.yape.dto.CreateTransactionRequest;
import com.desafio.yape.model.Transaction;
import com.desafio.yape.model.TransactionStatus;
import com.desafio.yape.model.TransactionType;
import com.desafio.yape.repository.TransactionRepository;
import com.desafio.yape.repository.TransactionStatusRepository;
import com.desafio.yape.repository.TransactionTypeRepository;
import com.desafio.yape.service.TransactionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
public class TransactionServiceImpl implements TransactionService {

    private static final Logger log = LoggerFactory.getLogger(TransactionServiceImpl.class);

    @Value("${yape.antifraud.threshold:1000}")
    private double antifraudThreshold;

    private final TransactionRepository transactionRepository;
    private final TransactionStatusRepository statusRepository;
    private final TransactionTypeRepository typeRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;

    public TransactionServiceImpl(TransactionRepository transactionRepository,
                                  TransactionStatusRepository statusRepository,
                                  TransactionTypeRepository typeRepository,
                                  KafkaTemplate<String, String> kafkaTemplate) {
        this.transactionRepository = transactionRepository;
        this.statusRepository = statusRepository;
        this.typeRepository = typeRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    @Override
    @Transactional
    public Transaction create(CreateTransactionRequest req) {
        Transaction tx = new Transaction();
        tx.setTransactionExternalId(UUID.randomUUID().toString());
        tx.setAccountExternalIdDebit(req.getAccountExternalIdDebit());
        tx.setAccountExternalIdCredit(req.getAccountExternalIdCredit());
        tx.setTransferTypeId(req.getTranferTypeId());
        tx.setAmount(req.getValue());

        TransactionStatus pending = statusRepository.findByName("pendiente").orElseThrow();
        tx.setTransactionStatus(pending);

        TransactionType type = typeRepository.findByName("transfer").orElseThrow();
        tx.setTransactionType(type);

        Transaction saved = transactionRepository.save(tx);

    String finalStatusName = (saved.getAmount() != null && saved.getAmount() > antifraudThreshold) ? "rechazado" : "aprobado";
        TransactionStatus finalStatus = statusRepository.findByName(finalStatusName).orElseThrow();
        saved.setTransactionStatus(finalStatus);
        transactionRepository.save(saved);

        
        try {
            String payload = String.format("{\"transactionExternalId\":\"%s\",\"status\":\"%s\"}", saved.getTransactionExternalId(), finalStatusName);
            kafkaTemplate.send("transaction-status", payload);
            System.out.println("Sent kafka message: " + payload);
        } catch (Exception e) {
            log.warn("Failed to send kafka message: {}", e.getMessage());
        }

        return saved;
    }

    @Override
    public Transaction findByExternalId(String externalId) {
        return transactionRepository.findByTransactionExternalId(externalId).orElse(null);
    }
}
