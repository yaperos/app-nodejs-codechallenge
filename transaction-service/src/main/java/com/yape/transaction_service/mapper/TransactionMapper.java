package com.yape.transaction_service.mapper;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yape.transaction_service.dto.*;
import com.yape.transaction_service.model.Transaction;
import com.yape.transaction_service.model.TransactionStatus;
import com.yape.transaction_service.model.TransactionType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class TransactionMapper {

    private final ObjectMapper objectMapper;

    public TransactionMapper(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public Transaction toEntity(TransactionRequestDto request) {
        if (request == null)
            return null;

        Transaction entity = new Transaction();
        entity.setAccountExternalIdDebit(request.getAccountExternalIdDebit());
        entity.setAccountExternalIdCredit(request.getAccountExternalIdCredit());
        entity.setTransactionAmount(request.getValue());

        TransactionStatus transactionStatus =  new TransactionStatus();
        transactionStatus.setId(1);
        entity.setStatus(transactionStatus);

        TransactionType transactionType = new TransactionType();
        transactionType.setId( request.getTransferTypeId() );
        entity.setTransferType(transactionType);

        try {
            String json = objectMapper.writeValueAsString(entity);
            log.info("Objeto Transaction (Entity)  formado: {}", json);
        } catch (Exception e) {
            log.error("Error al convertir entity a JSON", e);
        }
        return entity;
    }

    public TransactionResponseDto toResponseDto(Transaction entity) {
        if (entity == null) return null;

        TransactionResponseDto dto = new TransactionResponseDto();
        dto.setTransactionExternalId(entity.getId());
        dto.setValue(entity.getTransactionAmount());
        dto.setCreatedAt(entity.getCreatedAt());

        if (entity.getTransferType() != null) {
            TypeName typeName = new TypeName( entity.getTransferType().getName() );
            dto.setTransactionType(typeName);
        }

        if (entity.getStatus() != null) {
            StatusName statusName = new StatusName(entity.getStatus().getName());
            dto.setTransactionStatus(statusName);
        }

        try {
            String json = objectMapper.writeValueAsString(dto);
            log.info("Objeto TransactionResponseDto formado: {}", json);
        } catch (Exception e) {
            log.error("Error al convertir entity a JSON", e);
        }
        return dto;
    }

    public TransactionEventDto toEvent(Transaction completeEntity) {
        return TransactionEventDto.builder()
                .transactionId( completeEntity.getId() )
                .transactionAmount(completeEntity.getTransactionAmount())
                .transactionStatusId(completeEntity.getStatus().getId())
                .build();
    }
}