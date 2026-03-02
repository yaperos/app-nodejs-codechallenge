package com.yape.transaction_service.business;

import com.yape.transaction_service.dto.TransactionRequestDto;
import com.yape.transaction_service.dto.TransactionResponseDto;
import com.yape.transaction_service.dto.TransactionUpdateDto;
import com.yape.transaction_service.kafka.TransactionProducer;
import com.yape.transaction_service.mapper.TransactionMapper;
import com.yape.transaction_service.model.Transaction;
import com.yape.transaction_service.model.TransactionStatus;
import com.yape.transaction_service.model.TransactionType;
import com.yape.transaction_service.service.TransactionService;
import com.yape.transaction_service.service.TransactionStatusService;
import com.yape.transaction_service.service.TransactionTypeService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@AllArgsConstructor
@Component
public class TransactionBusiness {

    private final TransactionService transactionService;
    private final TransactionStatusService transactionStatusService;
    private final TransactionTypeService transactionTypeService;
    private final TransactionMapper transactionMapper;
    private final TransactionProducer producer;


    public TransactionResponseDto create(TransactionRequestDto request) {
        Transaction entity = transactionMapper.toEntity(request);
        Transaction saved = transactionService.save(entity);
        Transaction completeEntity = transactionService.findById(saved.getId())
                .orElseThrow(() -> new RuntimeException("Error al recuperar la transacción creada"));
        TransactionType type = transactionTypeService.findById(completeEntity.getTransferType().getId()).get();
        TransactionStatus status = transactionStatusService.findById(completeEntity.getStatus().getId()).get();
        completeEntity.setTransferType(type);
        completeEntity.setStatus(status);
        producer.sendTransactionCreated(transactionMapper.toEvent(completeEntity));
        return transactionMapper.toResponseDto( completeEntity );
    }

    public TransactionResponseDto findById(UUID id) {
        return transactionMapper.toResponseDto( transactionService.findById(id)
                .orElseThrow( () -> new RuntimeException("Error al recuperar la transacción, id="+id) ) );
    }


    public TransactionResponseDto updateTransaction(UUID id, TransactionUpdateDto transactionUpdate) {
        Transaction transactionToUpdate = transactionService.findById(id)
                .orElseThrow(() -> new RuntimeException("Error al recuperar la transacción consultada"));
        TransactionStatus newStatus = transactionStatusService
                .findFirstByName( transactionUpdate.getStatus().name() )
                .orElseThrow(() -> new RuntimeException("Estado no encontrado en BD"));
        transactionToUpdate.setStatus(newStatus);
        transactionService.save(transactionToUpdate);
        Transaction updated = transactionService.findById(id)
                .orElseThrow(() -> new RuntimeException("Error al recuperar la transaccion actualizada"));

        return transactionMapper.toResponseDto(updated);
    }
}
