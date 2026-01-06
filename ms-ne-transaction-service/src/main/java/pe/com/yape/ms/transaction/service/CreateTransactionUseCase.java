package pe.com.yape.ms.transaction.service;

import java.math.BigDecimal;
import java.util.UUID;
import pe.com.yape.ms.transaction.model.domain.Transaction;

/**
 * Caso de Uso: Crear una nueva transacción
 *
 * @author lmarusic
 * @version 1.0.0
 */
public interface CreateTransactionUseCase {
    
    /**
     * Crea una nueva transacción en estado PENDING
     *
     * @param accountExternalIdDebit cuenta de débito
     * @param accountExternalIdCredit cuenta de crédito
     * @param transferTypeId tipo de transferencia
     * @param value monto de la transacción
     * @return Transaction
     */
    Transaction execute(
        UUID accountExternalIdDebit,
        UUID accountExternalIdCredit,
        int transferTypeId,
        BigDecimal value
    );
}

