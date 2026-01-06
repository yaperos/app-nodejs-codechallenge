package pe.com.yape.ms.transaction.service.port;

import java.util.Optional;
import java.util.UUID;
import pe.com.yape.ms.transaction.model.domain.Transaction;

/**
 * Interface para persistencia de repositorio de transacciones
 *
 * @author lmarusic
 * @version 1.0.0
 */
public interface TransactionRepositoryPort {
    
    /**
     * Guarda una nueva transaccion en el sistema
     * 
     * @param transaction transaccion a persistir
     * @return Transaction
     */
    Transaction save(Transaction transaction);
    
    /**
     * Busca una transacción por su ID externo
     * 
     * @param transactionExternalId identificador único de la transacción
     * @return Optional con Transaction si existe, vacío si no
     */
    Optional<Transaction> findByExternalId(UUID transactionExternalId);
    
    /**
     * Actualiza el estado de una transaccion existente
     * 
     * @param transaction transaccion con el nuevo estado
     * @return Transaction
     */
    Transaction update(Transaction transaction);
    
    /**
     * Verifica si existe una transaccion con el ID externo dado
     * 
     * @param transactionExternalId identificador único de la transacción
     * @return true si existe, false si no
     */
    boolean existsByExternalId(UUID transactionExternalId);
}

