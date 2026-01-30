package com.yape.antifraud.aplication;

import com.yape.antifraud.kafka.models.TransactionRespEvent;

public interface ProducerService {

  void sendMessage(TransactionRespEvent transaction);
}
