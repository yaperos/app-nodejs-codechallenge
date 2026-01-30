package com.yape.antifraud;

import java.util.UUID;
import com.yape.antifraud.aplication.ProducerService;
import com.yape.antifraud.aplication.impl.FraudDetectionService;
import com.yape.antifraud.aplication.impl.FraudPolicy;
import com.yape.antifraud.kafka.models.TransactionReqEvent;
import com.yape.antifraud.kafka.models.TransactionRespEvent;
import com.yape.antifraud.model.TransactionStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static com.yape.antifraud.utils.Constants.MAX_ALLOWED_VALUE;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class FraudDetectionServiceTest {

  @Mock
  private ProducerService producerService;

  private FraudDetectionService service;

  @BeforeEach
  void setup() {
    FraudPolicy fraudPolicy = new FraudPolicy(); // REAL
    service = new FraudDetectionService(fraudPolicy, producerService);
  }

  @Test
  void shouldTransactionNotFraud() {
    TransactionReqEvent request = new TransactionReqEvent(UUID.randomUUID(), MAX_ALLOWED_VALUE - 10, null);

    service.analyze(request);

    ArgumentCaptor<TransactionRespEvent> captor = ArgumentCaptor.forClass(TransactionRespEvent.class);

    verify(producerService).sendMessage(captor.capture());

    assertThat(request.getStatus()).isEqualTo(TransactionStatus.APPROVED);
    assertThat(captor.getValue().status()).isEqualTo(TransactionStatus.APPROVED);
  }

  @Test
  void shouldTransactionIsFraud() {
    TransactionReqEvent request = new TransactionReqEvent(UUID.randomUUID(), MAX_ALLOWED_VALUE + 1, null);

    service.analyze(request);

    ArgumentCaptor<TransactionRespEvent> captor =
      ArgumentCaptor.forClass(TransactionRespEvent.class);

    verify(producerService).sendMessage(captor.capture());

    assertThat(request.getStatus()).isEqualTo(TransactionStatus.REJECTED);
    assertThat(captor.getValue().status()).isEqualTo(TransactionStatus.REJECTED);
  }
}
