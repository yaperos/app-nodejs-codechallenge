package com.jaragon.solution.model.mappers;

import com.jaragon.solution.model.CreateTransactionRequestDTO;
import com.jaragon.solution.model.TransactionEvent;
import com.jaragon.solution.model.TransactionResponseDTO;
import com.jaragon.solution.model.TransactionStatus;
import com.jaragon.solution.model.TransactionStatusDTO;
import com.jaragon.solution.model.TransactionTypeDTO;
import com.jaragon.solution.model.entity.TransactionEntity;
import java.time.LocalDateTime;
import java.util.UUID;

public class TransactionMapper {

  public static TransactionResponseDTO toDTO(TransactionEntity entity) {
    TransactionResponseDTO dto = new TransactionResponseDTO();

    dto.setTransactionExternalId(entity.getTransactionExternalId());
    dto.setValue(entity.getValue());
    dto.setCreatedAt(entity.getCreatedAt());

    TransactionTypeDTO typeDTO = new TransactionTypeDTO();
    typeDTO.setName(entity.getTransactionType());
    dto.setTransactionType(typeDTO);

    TransactionStatusDTO statusDTO = new TransactionStatusDTO();
    statusDTO.setName(entity.getTransactionStatus());
    dto.setTransactionStatus(statusDTO);

    return dto;
  }

  public static TransactionEntity toEntity(CreateTransactionRequestDTO createTransactionRequestDTO){
    TransactionEntity transactionEntity = new TransactionEntity();

    transactionEntity.setTransactionExternalId(UUID.randomUUID());
    transactionEntity.setAccountExternalIdCredit(createTransactionRequestDTO.getAccountExternalIdCredit());
    transactionEntity.setAccountExternalIdDebit(createTransactionRequestDTO.getAccountExternalIdDebit());
    transactionEntity.setTransactionType(String.valueOf(createTransactionRequestDTO.getTranferTypeId()));
    transactionEntity.setTransactionStatus(TransactionStatus.PENDING.getValue());
    transactionEntity.setValue(createTransactionRequestDTO.getValue());
    transactionEntity.setCreatedAt(LocalDateTime.now());
    return transactionEntity;
  }

  public static TransactionEvent toTransactionEvent(TransactionEntity transactionEntity){
    return new TransactionEvent(transactionEntity.getTransactionExternalId(), transactionEntity.getValue());
  }
}
