package pe.com.yape.transaction.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.com.yape.transaction.models.entities.TransactionEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<TransactionEntity, UUID> {

    Optional<TransactionEntity> findByTransactionExternalId(UUID externalId);
    List<TransactionEntity> findAllByOrderByCreatedAtDesc();

}