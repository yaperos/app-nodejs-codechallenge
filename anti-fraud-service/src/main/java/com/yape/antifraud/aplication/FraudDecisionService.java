package com.yape.antifraud.aplication;

import com.yape.antifraud.kafka.models.TransactionReqEvent;

public interface FraudDecisionService {

  void analyze(TransactionReqEvent transaction);
}
