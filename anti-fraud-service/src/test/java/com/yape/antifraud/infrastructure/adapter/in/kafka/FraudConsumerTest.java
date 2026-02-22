package com.yape.antifraud.infrastructure.adapter.in.kafka;

import com.yape.antifraud.application.service.EvaluateFraudApplicationService;
import com.yape.antifraud.domain.model.FraudEvaluation;
import com.yape.antifraud.domain.port.out.FraudResultPublisher;
import com.yape.antifraud.domain.service.FraudEvaluationService;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class FraudConsumerTest {

    @Test
    void shouldEvaluateAndPublishApprovedResult() {
        CapturingFraudResultPublisher publisher = new CapturingFraudResultPublisher();
        FraudEvaluationService domainService = new FraudEvaluationService();
        EvaluateFraudApplicationService useCase = new EvaluateFraudApplicationService(domainService, publisher);
        FraudKafkaConsumer consumer = new FraudKafkaConsumer(useCase);

        UUID transactionId = UUID.randomUUID();
        TransactionCreatedMessage message = new TransactionCreatedMessage(transactionId, new BigDecimal("500"));
        ConsumerRecord<String, TransactionCreatedMessage> record =
                new ConsumerRecord<>("yape.transaction.event.created.v1", 0, 0L, transactionId.toString(), message);

        consumer.consume(record);

        assertThat(publisher.publishedResults).hasSize(1);
        assertThat(publisher.publishedResults.getFirst().transactionId()).isEqualTo(transactionId);
        assertThat(publisher.publishedResults.getFirst().status()).isEqualTo("approved");
    }

    @Test
    void shouldEvaluateAndPublishRejectedResult() {
        CapturingFraudResultPublisher publisher = new CapturingFraudResultPublisher();
        FraudEvaluationService domainService = new FraudEvaluationService();
        EvaluateFraudApplicationService useCase = new EvaluateFraudApplicationService(domainService, publisher);
        FraudKafkaConsumer consumer = new FraudKafkaConsumer(useCase);

        UUID transactionId = UUID.randomUUID();
        TransactionCreatedMessage message = new TransactionCreatedMessage(transactionId, new BigDecimal("5000"));
        ConsumerRecord<String, TransactionCreatedMessage> record =
                new ConsumerRecord<>("yape.transaction.event.created.v1", 0, 0L, transactionId.toString(), message);

        consumer.consume(record);

        assertThat(publisher.publishedResults).hasSize(1);
        assertThat(publisher.publishedResults.getFirst().transactionId()).isEqualTo(transactionId);
        assertThat(publisher.publishedResults.getFirst().status()).isEqualTo("rejected");
    }

    static class CapturingFraudResultPublisher implements FraudResultPublisher {
        final List<FraudEvaluation> publishedResults = new ArrayList<>();

        @Override
        public void publishResult(FraudEvaluation evaluation) {
            publishedResults.add(evaluation);
        }
    }
}
