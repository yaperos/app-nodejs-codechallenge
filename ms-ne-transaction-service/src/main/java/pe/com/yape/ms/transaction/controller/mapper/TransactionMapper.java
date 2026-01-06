package pe.com.yape.ms.transaction.controller.mapper;

import org.springframework.stereotype.Component;
import pe.com.yape.ms.transaction.controller.dto.TransactionResponse;
import pe.com.yape.ms.transaction.controller.dto.TransactionStatusDto;
import pe.com.yape.ms.transaction.controller.dto.TransactionTypeDto;
import pe.com.yape.ms.transaction.model.domain.Transaction;

/**
 * Mapper para convertir entre objetos de dominio y DTOs
 * @author lmarusic
 */
@Component
public class TransactionMapper {
    
    /**
     * Convierte una transacción del dominio a DTO de respuesta
     */
    public TransactionResponse toResponse(Transaction transaction) {
        return TransactionResponse.builder()
                .transactionExternalId(transaction.transactionExternalId())
                .transactionType(TransactionTypeDto.builder()
                        .name(transaction.transactionType().getName())
                        .build())
                .transactionStatus(TransactionStatusDto.builder()
                        .name(transaction.status().getValue())
                        .build())
                .value(transaction.value())
                .createdAt(transaction.createdAt())
                .build();
    }
}

