package com.jaragon.antifraud.service;

import com.jaragon.antifraud.model.AntifraudResponse;
import com.jaragon.antifraud.model.TransactionCode;
import com.jaragon.antifraud.model.TransactionEvent;
import com.jaragon.antifraud.model.TransactionStatus;
import com.jaragon.antifraud.util.Logger;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class AntiFraudService {

  private final KafkaTemplate<Object, Object> kafkaTemplate;
  private final Double maxApprovedValue;

  public AntiFraudService(KafkaTemplate<Object, Object> kafkaTemplate,
                          @Value("${antifraud.max-approved-value}") Double maxApprovedValue) {
    this.kafkaTemplate = kafkaTemplate;
    this.maxApprovedValue = maxApprovedValue;
  }

  @KafkaListener(topics = "transactions-to-validate", groupId = "antifraud-group")
  public void consume(TransactionEvent event) {

    UUID transactionExternalId = event.getTransactionExternalId();
    Logger.info("Validando transacción: " + transactionExternalId);
    AntifraudResponse response;

    try{
      TransactionStatus finalStatus = getStatus(event.getValue());
      response = createOkResponse(transactionExternalId,finalStatus);
    }catch (Exception e){
      Logger.info("Hubo un problema al procesar la transaccion : " + transactionExternalId);
      response = createBadResponse(transactionExternalId);
    }

    kafkaTemplate.send("transactions-validated", response);
    Logger.info("Resultado enviado: " + response.getStatus());
  }

  private TransactionStatus getStatus(Double value){
    return (value > maxApprovedValue) ? TransactionStatus.REJECTED : TransactionStatus.APPROVED;
  }

  private AntifraudResponse createOkResponse(UUID transactionExternalId, TransactionStatus status){
    return new AntifraudResponse(transactionExternalId, status, TransactionCode.OK);
  }

  private AntifraudResponse createBadResponse(UUID transactionExternalId){
    return new AntifraudResponse(transactionExternalId, TransactionStatus.REJECTED, TransactionCode.ERROR);
  }

}