package pe.com.yape.transaction.infraestructure.adapter.out.persistence.postgresql.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.com.yape.transaction.infraestructure.adapter.out.persistence.postgresql.entity.TransactionEntity;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<TransactionEntity, Long> {

    Optional<TransactionEntity> findByTransactionExternalId(UUID transactionExternalId);

}
