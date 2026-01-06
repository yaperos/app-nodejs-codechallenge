package pe.com.yape.ms.transaction.service;

import java.util.UUID;
import pe.com.yape.ms.transaction.model.domain.Transaction;

/**
 * Caso de Uso: Obtener una transacción por ID
 *
 * @author lmarusic
 * @version 1.0.0
 */
public interface GetTransactionUseCase {
    
    /**
     * Obtiene una transacción por su ID externo
     * 
     * @param transactionExternalId ID único de la transacción
     * @return Transaction
     * @throws pe.com.yape.ms.transaction.application.exception.TransactionNotFoundException si no existe
     */
    Transaction execute(UUID transactionExternalId);
}

