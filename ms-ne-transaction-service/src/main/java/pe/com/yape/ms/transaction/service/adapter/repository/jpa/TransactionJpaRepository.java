package pe.com.yape.ms.transaction.service.adapter.repository.jpa;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.com.yape.ms.transaction.model.entity.TransactionEntity;

/**
 * Repositorio JPA de TransactionEntity
 * 
 * @author lmarusic
 * @version 1.0.0
 */
@Repository
public interface TransactionJpaRepository extends JpaRepository<TransactionEntity, Long> {
    
    /**
     * Busca una transaccion por su ID
     */
    Optional<TransactionEntity> findByTransactionExternalId(UUID transactionExternalId);
    
    /**
     * Verifica si existe una transaccion con el ID
     */
    boolean existsByTransactionExternalId(UUID transactionExternalId);
}

