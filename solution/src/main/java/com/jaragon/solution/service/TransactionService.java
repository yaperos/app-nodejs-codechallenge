package com.jaragon.solution.service;

import com.jaragon.solution.model.AntifraudResponse;
import com.jaragon.solution.model.CreateTransactionRequestDTO;
import com.jaragon.solution.model.TransactionResponseDTO;
import com.jaragon.solution.model.entity.TransactionEntity;
import com.jaragon.solution.model.mappers.TransactionMapper;
import com.jaragon.solution.repository.TransactionRepository;
import com.jaragon.solution.util.Logger;
import jakarta.transaction.Transactional;
import java.util.Optional;
import java.util.UUID;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class TransactionService {

  private final KafkaTemplate<Object, Object> kafkaTemplate;
  private final TransactionRepository transactionRepository;

  public TransactionService(KafkaTemplate<Object, Object> kafkaTemplate, TransactionRepository transactionRepository) {
    this.kafkaTemplate = kafkaTemplate;
    this.transactionRepository = transactionRepository;
  }


  public TransactionResponseDTO createTransaction(CreateTransactionRequestDTO createTransactionRequestDTO){

    Logger.info("Creating transaction");
    TransactionEntity transactionEntity = TransactionMapper.toEntity(createTransactionRequestDTO);

    transactionRepository.save(transactionEntity);

    kafkaTemplate.send("transactions-to-validate", TransactionMapper.toTransactionEvent(transactionEntity));

    return TransactionMapper.toDTO(transactionEntity);
  }

  public TransactionResponseDTO getTransaction(UUID transactionExternalId){

    Logger.info("Retrieving transaction");
    Optional<TransactionEntity> optionalTransactionEntity = transactionRepository.findByTransactionExternalId(transactionExternalId);

    if(optionalTransactionEntity.isPresent()) return TransactionMapper.toDTO(optionalTransactionEntity.get());
    // Se podria manejar una excepcion personalizada
    throw new RuntimeException();
  }

  @KafkaListener(topics = "transactions-validated", groupId = "transaction-group")
  public void consume(AntifraudResponse antifraudResponse) {

    Optional<TransactionEntity> optionalTransactionEntity = transactionRepository.findByTransactionExternalId(antifraudResponse.getTransactionExternalId());

    if(optionalTransactionEntity.isPresent()){
      Logger.info("Updating transaction");
      TransactionEntity transactionEntity = optionalTransactionEntity.get();
      transactionEntity.setTransactionStatus(antifraudResponse.getStatus());
      transactionRepository.save(transactionEntity);
    }
  }

}
