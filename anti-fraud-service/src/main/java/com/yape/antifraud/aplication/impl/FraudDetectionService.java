package com.yape.antifraud.aplication.impl;

import com.yape.antifraud.kafka.models.TransactionRespEvent;
import com.yape.antifraud.model.TransactionStatus;
import com.yape.antifraud.kafka.models.TransactionReqEvent;
import com.yape.antifraud.aplication.FraudDecisionService;
import com.yape.antifraud.aplication.ProducerService;
import org.springframework.stereotype.Service;

@Service
public class FraudDetectionService implements FraudDecisionService {

  private final FraudPolicy fraudPolicy;
  private final ProducerService producer;

  public FraudDetectionService(FraudPolicy fraudPolicy, ProducerService producer){
    this.fraudPolicy = fraudPolicy;
    this.producer = producer;
  }

  @Override
  public void analyze(TransactionReqEvent transaction) {

    var isFraud = fraudPolicy.isFraud(transaction.getAmount());
    var statusTrx = isFraud? TransactionStatus.REJECTED : TransactionStatus.APPROVED;
    transaction.setStatus(statusTrx);

    var updateTransaction = getUpdateEvent(transaction);
    producer.sendMessage(updateTransaction);
  }

  private TransactionRespEvent getUpdateEvent(TransactionReqEvent transaction){
    return new TransactionRespEvent(transaction.getId(), transaction.getStatus());
  }
}
