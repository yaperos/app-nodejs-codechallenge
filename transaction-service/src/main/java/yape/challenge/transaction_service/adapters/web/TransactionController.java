package yape.challenge.transaction_service.adapters.web;

import yape.challenge.common.events.TransactionCreatedEvent;
import yape.challenge.transaction_service.adapters.messaging.KafkaTransactionProducer;
import yape.challenge.transaction_service.adapters.persistence.TransactionEntity;
import yape.challenge.transaction_service.adapters.persistence.TransactionJpaRepository;
import yape.challenge.transaction_service.adapters.web.dto.CreateTransactionRequest;
import yape.challenge.transaction_service.adapters.web.dto.NamedObject;
import yape.challenge.transaction_service.adapters.web.dto.TransactionResponse;
import yape.challenge.transaction_service.domain.TransactionStatus;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.UUID;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionJpaRepository repo;
    private final KafkaTransactionProducer producer;

    public TransactionController(TransactionJpaRepository repo, KafkaTransactionProducer producer) {
        this.repo = repo;
        this.producer = producer;
    }

    @PostMapping
    public ResponseEntity<TransactionResponse> create(@Valid @RequestBody CreateTransactionRequest req) {
        String externalId = UUID.randomUUID().toString();

        TransactionEntity tx = new TransactionEntity();
        tx.setTransactionExternalId(externalId);
        tx.setAccountExternalIdDebit(req.getAccountExternalIdDebit());
        tx.setAccountExternalIdCredit(req.getAccountExternalIdCredit());
        tx.setTransferTypeId(req.getTranferTypeId());
        tx.setValue(req.getValue());
        tx.setStatus(TransactionStatus.PENDING);
        tx.setCreatedAt(Instant.now());

        tx = repo.save(tx);

        TransactionCreatedEvent event = new TransactionCreatedEvent();
        event.transactionExternalId = tx.getTransactionExternalId();
        event.accountExternalIdDebit = tx.getAccountExternalIdDebit();
        event.accountExternalIdCredit = tx.getAccountExternalIdCredit();
        event.transferTypeId = tx.getTransferTypeId();
        event.value = tx.getValue();
        event.createdAt = tx.getCreatedAt();

        producer.publishCreated(event);

        return ResponseEntity.status(201).body(toResponse(tx));
    }

    @GetMapping("/{transactionExternalId}")
    public ResponseEntity<TransactionResponse> get(@PathVariable String transactionExternalId) {
        return repo.findByTransactionExternalId(transactionExternalId)
                .map(tx -> ResponseEntity.ok(toResponse(tx)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    private TransactionResponse toResponse(TransactionEntity tx) {
        return new TransactionResponse(
                tx.getTransactionExternalId(),
                new NamedObject("TYPE_" + tx.getTransferTypeId()),
                new NamedObject(tx.getStatus().name().toLowerCase()), // pending/approved/rejected
                tx.getValue(),
                tx.getCreatedAt()
        );
    }

}