package pe.com.yape.ms.transaction.service.port;

import pe.com.yape.ms.transaction.model.domain.Transaction;

import java.util.Optional;
import java.util.UUID;

/**
 * Puerto de salida para operaciones de cache (Redis)
 * 
 * @author lmarusic
 * @version 1.0.0
 */
public interface CacheRepositoryPort {
    
    /**
     * Guarda una transacción en cache
     * 
     * @param transaction transacción a cachear
     * @param ttlSeconds tiempo de vida en segundos
     */
    void save(Transaction transaction, long ttlSeconds);
    
    /**
     * Busca una transacción en cache
     * 
     * @param transactionExternalId ID de la transacción
     * @return Optional con la transacción si existe en cache
     */
    Optional<Transaction> findByExternalId(UUID transactionExternalId);
    
    /**
     * Elimina una transacción del cache
     * 
     * @param transactionExternalId ID de la transacción
     */
    void evict(UUID transactionExternalId);
    
    /**
     * Limpia todo el cache de transacciones
     */
    void clear();
}

