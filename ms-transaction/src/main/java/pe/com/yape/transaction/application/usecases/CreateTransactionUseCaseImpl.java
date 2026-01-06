package pe.com.yape.transaction.application.usecases;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.com.yape.transaction.domain.events.TransactionCreatedEvent;
import pe.com.yape.transaction.domain.model.Transaction;
import pe.com.yape.transaction.domain.model.TransactionStatus;
import pe.com.yape.transaction.domain.model.valueObjects.AccountExternalId;
import pe.com.yape.transaction.domain.model.valueObjects.Amount;
import pe.com.yape.transaction.domain.model.valueObjects.TransactionId;
import pe.com.yape.transaction.domain.model.valueObjects.TransferTypeId;
import pe.com.yape.transaction.domain.port.in.CreateTransactionUseCase;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pe.com.yape.transaction.domain.port.out.EventPublisherPort;
import pe.com.yape.transaction.domain.port.out.TransactionRepositoryPort;

import java.time.LocalDateTime;


@Service
public class CreateTransactionUseCaseImpl implements CreateTransactionUseCase {

    private static final Logger logger = LoggerFactory.getLogger(CreateTransactionUseCaseImpl.class);

    private final TransactionRepositoryPort transactionRepository;
    private final EventPublisherPort eventPublisher;

    public CreateTransactionUseCaseImpl(
            TransactionRepositoryPort transactionRepository,
            EventPublisherPort eventPublisher) {
        this.transactionRepository = transactionRepository;
        this.eventPublisher = eventPublisher;
    }

    @Override
    @Transactional
    public Transaction create(AccountExternalId accountExternalIdDebit, AccountExternalId accountExternalIdCredit, TransferTypeId transferTypeId, Amount value) {

        logger.info("Creating transaction with amount: {}", value.getValue());

        Transaction transaction = Transaction.builder()
                .transactionExternalId(TransactionId.generate())
                .accountExternalIdDebit(accountExternalIdDebit)
                .accountExternalIdCredit(accountExternalIdCredit)
                .transferTypeId(transferTypeId)
                .amount(value)
                .status(TransactionStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();


        Transaction savedTransaction = transactionRepository.save(transaction);
        logger.info("Transaction saved with ID: {}", savedTransaction.getTransactionExternalId());


        TransactionCreatedEvent event = new TransactionCreatedEvent(savedTransaction);
        eventPublisher.publishTransactionCreated(event);
        logger.info("Transaction created event published for ID: {}",
                savedTransaction.getTransactionExternalId());

        return savedTransaction;
    }
}
