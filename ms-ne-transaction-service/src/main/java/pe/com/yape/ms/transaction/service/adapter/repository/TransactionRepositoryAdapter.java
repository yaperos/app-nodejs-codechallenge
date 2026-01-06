package pe.com.yape.ms.transaction.service.adapter.repository;

import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import pe.com.yape.ms.transaction.model.domain.Transaction;
import pe.com.yape.ms.transaction.model.entity.TransactionEntity;
import pe.com.yape.ms.transaction.service.port.TransactionRepositoryPort;
import pe.com.yape.ms.transaction.service.adapter.repository.jpa.TransactionJpaRepository;

/**
 * TransactionRepositoryAdapter
 *
 * @author lmarusic
 * @version 1.0.0
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class TransactionRepositoryAdapter implements TransactionRepositoryPort {
    
    private final TransactionJpaRepository jpaRepository;
    
    @Override
    public Transaction save(Transaction transaction) {
        log.debug("Saving transaction: {}", transaction.transactionExternalId());
        
        TransactionEntity entity = TransactionEntity.fromDomain(transaction);
        TransactionEntity savedEntity = jpaRepository.save(entity);
        log.info("Transaction saved successfully: {}", savedEntity.getTransactionExternalId());
        return savedEntity.toDomain();
    }
    
    @Override
    public Optional<Transaction> findByExternalId(UUID transactionExternalId) {
        log.debug("Finding transaction by external ID: {}", transactionExternalId);
        return jpaRepository.findByTransactionExternalId(transactionExternalId)
                .map(entity -> {
                    log.debug("Transaction found: {}", transactionExternalId);
                    return entity.toDomain();
                });
    }
    
    @Override
    public Transaction update(Transaction transaction) {
        log.debug("Updating transaction: {}", transaction.transactionExternalId());
        
        // Verificar que existe antes de actualizar
        TransactionEntity existingEntity = jpaRepository
                .findByTransactionExternalId(transaction.transactionExternalId())
                .orElseThrow(() -> new RuntimeException("Transaction not found for update"));
        
        // Actualizar campos
        existingEntity.setStatus(transaction.status());
        existingEntity.setUpdatedAt(transaction.updatedAt());
        
        TransactionEntity updatedEntity = jpaRepository.save(existingEntity);
        
        log.info("Transaction updated successfully: {}", updatedEntity.getTransactionExternalId());
        return updatedEntity.toDomain();
    }
    
    @Override
    public boolean existsByExternalId(UUID transactionExternalId) {
        log.debug("Checking if transaction exists: {}", transactionExternalId);
        return jpaRepository.existsByTransactionExternalId(transactionExternalId);
    }
}

