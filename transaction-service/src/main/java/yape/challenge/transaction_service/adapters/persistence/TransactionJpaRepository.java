package yape.challenge.transaction_service.adapters.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TransactionJpaRepository extends JpaRepository<TransactionEntity, Long> {
    Optional<TransactionEntity> findByTransactionExternalId(String externalId);
}