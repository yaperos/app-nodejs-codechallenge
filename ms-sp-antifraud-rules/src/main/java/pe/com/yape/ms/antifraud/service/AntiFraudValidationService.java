package pe.com.yape.ms.antifraud.service;

import pe.com.yape.ms.antifraud.model.domain.Transaction;
import pe.com.yape.ms.antifraud.model.domain.TransactionValidation;

/**
 * Puerto de dominio para la validación antifraude
 * @author lmarusic
 */
public interface AntiFraudValidationService {
    
    /**
     * Valida una transacción contra las reglas antifraude
     *
     * @param transaction Transacción a validar
     * @return Resultado de la validación
     */
    TransactionValidation validate(Transaction transaction);
}

