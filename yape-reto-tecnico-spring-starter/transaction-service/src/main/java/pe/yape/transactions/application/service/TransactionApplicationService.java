package pe.yape.transactions.application.service;

import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.yape.transactions.api.dto.*;
import pe.yape.transactions.domain.event.TransactionCreatedEvent;
import pe.yape.transactions.domain.model.Transaction;
import pe.yape.transactions.domain.model.TransactionStatus;
import pe.yape.transactions.domain.repository.TransactionRepository;
import pe.yape.transactions.infrastructure.kafka.producer.TransactionEventPublisher;

@Service
public class TransactionApplicationService {

    private final TransactionRepository repository;
    private final TransactionEventPublisher publisher;

    public TransactionApplicationService(TransactionRepository repository,
                                         TransactionEventPublisher publisher) {
        this.repository = repository;
        this.publisher = publisher;
    }

    @Transactional
    public CreateTransactionResponse create(CreateTransactionRequest request){

        if(request.accountExternalIdDebit().equals(request.accountExternalIdCredit())){
            throw new IllegalArgumentException("Debit and Credit accounts must be different");
        }

        Transaction tx = Transaction.newPending(
                request.accountExternalIdDebit(),
                request.accountExternalIdCredit(),
                request.tranferTypeId(),
                request.value()
        );

        repository.save(tx);

        publisher.publish(new TransactionCreatedEvent(
                tx.getTransactionExternalId(),
                tx.getAccountExternalIdDebit(),
                tx.getAccountExternalIdCredit(),
                tx.getTranferTypeId(),
                tx.getValue()
        ));

        return new CreateTransactionResponse(
                tx.getTransactionExternalId(),
                new NameDto(TransactionStatus.PENDING.name())
        );
    }

    @Transactional(readOnly = true)
    public TransactionResponse get(UUID transactionExternalId){

        Transaction tx = repository.findByExternalId(transactionExternalId)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found: " + transactionExternalId));

        return new TransactionResponse(
                tx.getTransactionExternalId(),
                new NameDto("TRANSFER"),
                new NameDto(tx.getStatus().name()),
                tx.getValue(),
                tx.getCreatedAt()
        );
    }
}