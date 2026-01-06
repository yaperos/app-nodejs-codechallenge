package pe.com.yape.transaction.infraestructure.adapter.out.persistence.postgresql;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import pe.com.yape.transaction.domain.model.Transaction;
import pe.com.yape.transaction.domain.model.valueObjects.TransactionId;
import pe.com.yape.transaction.domain.port.out.TransactionRepositoryPort;
import pe.com.yape.transaction.infraestructure.adapter.out.persistence.postgresql.entity.TransactionEntity;
import pe.com.yape.transaction.infraestructure.adapter.out.persistence.postgresql.mapper.TransactionEntityMapper;
import pe.com.yape.transaction.infraestructure.adapter.out.persistence.postgresql.repository.TransactionRepository;

import java.util.Optional;

@Component
public class TransactionPostgresAdapter implements TransactionRepositoryPort {

    private static final Logger logger = LoggerFactory.getLogger(TransactionPostgresAdapter.class);

    private final TransactionRepository jpaRepository;
    private final TransactionEntityMapper entityMapper;

    public TransactionPostgresAdapter(
            TransactionRepository jpaRepository,
            TransactionEntityMapper entityMapper) {
        this.jpaRepository = jpaRepository;
        this.entityMapper = entityMapper;
    }

    @Override
    public Transaction save(Transaction transaction) {
        logger.debug("Saving transaction: {}", transaction.getTransactionExternalId());

        TransactionEntity entity = entityMapper.toEntity(transaction);
        TransactionEntity savedEntity = jpaRepository.save(entity);

        logger.debug("Transaction saved with internal ID: {}", savedEntity.getId());

        return entityMapper.toDomain(savedEntity);
    }

    @Override
    public Optional<Transaction> findById(TransactionId transactionId) {
        logger.debug("Finding transaction by ID: {}", transactionId);

        return jpaRepository.findByTransactionExternalId(transactionId.getValue())
                .map(entityMapper::toDomain);
    }

    @Override
    public Transaction update(Transaction transaction) {
        logger.debug("Updating transaction: {}", transaction.getTransactionExternalId());

        TransactionEntity existingEntity = jpaRepository
                .findByTransactionExternalId(transaction.getTransactionExternalId().getValue())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Transaction not found: " + transaction.getTransactionExternalId()
                ));

        existingEntity.setStatus(transaction.getStatus().getName());
        existingEntity.setUpdatedAt(transaction.getUpdatedAt());

        TransactionEntity updatedEntity = jpaRepository.save(existingEntity);

        return entityMapper.toDomain(updatedEntity);
    }
}
