package pe.yape.transactions.infrastructure.persistence.jpa;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.yape.transactions.infrastructure.persistence.entity.TransactionEntity;

public interface SpringDataTransactionRepository extends JpaRepository<TransactionEntity, Long> {
    Optional<TransactionEntity> findByTransactionExternalId(UUID transactionExternalId);
}