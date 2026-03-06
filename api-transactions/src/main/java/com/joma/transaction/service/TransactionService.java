package com.joma.transaction.service;

import com.joma.transaction.commons.TransactionStatus;
import com.joma.transaction.commons.TransactionType;
import com.joma.transaction.dto.TransactionRequest;
import com.joma.transaction.dto.TransactionResponse;
import com.joma.transaction.entity.Transaction;
import com.joma.transaction.repository.TransactionRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import tools.jackson.databind.ObjectMapper;

import java.time.Instant;
import java.util.UUID;

@Service
public class TransactionService {
    private static final Logger log = LoggerFactory.getLogger(TransactionService.class);

    private final TransactionRepo repo;

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    private static final String TOPIC = "transaction-topic";

    public TransactionService(TransactionRepo repository, KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
        this.repo = repository;
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    /**
     * busca en la tabla read, el evento por id de transaccion generada (uuid)
     *
     * @param id
     * @return
     */
    public Mono<Transaction> getById(String id) {
        return repo.findBytransactionExternalId(id);
    }

    /**
     * se crea la transaccion y deja el evento en una cola
     *
     * @param request
     * @return
     */
    public TransactionResponse createTransaction(TransactionRequest request) {
        String uuid = UUID.randomUUID().toString();
        Instant now = Instant.now();
        TransactionType tt = TransactionType.fromCode(request.transferTypeId());

        Transaction transaction = new Transaction(
                uuid, request.accountExternalIdDebit(), request.accountExternalIdCredit(), tt.name(),
                request.amount(), TransactionStatus.PENDIENTE.name(), now
        );
        String payload = objectMapper.writeValueAsString(transaction);
        kafkaTemplate.send(TOPIC, payload)
                .thenAccept(result -> log.debug("Enviado:Trx: {}", uuid))
                .exceptionally(ex -> {
                    //reenvio a cola DLQ
                    return null;
                });
        return new TransactionResponse(
                uuid,
                tt.name(),
                now
        );
    }
}
