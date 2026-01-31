package com.devpull.antifraudservice.controller;

import com.devpull.antifraudservice.dto.TransactionCreatedEvent;
import com.devpull.antifraudservice.dto.TransactionStatusChangedEvent;
import com.devpull.antifraudservice.kafka.EventProducer;
import com.devpull.antifraudservice.service.AntifraudEvaluationService;
import com.devpull.transactionservice.domain.enums.TransactionStatus;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/v1/antifraud")
@Slf4j
public class AntifraudController {

    private final EventProducer eventProducer;

    private final AntifraudEvaluationService evaluationService;


    public AntifraudController(EventProducer eventProducer,
                               AntifraudEvaluationService evaluationService) {
        this.eventProducer = eventProducer;
        this.evaluationService = evaluationService;
    }

    @PostMapping
    public ResponseEntity<String> evaluateAntifraud(@Valid @RequestBody TransactionCreatedEvent transaction) {
        log.info("[ANTIFRAUD] Evaluating transactionId={}, amount={}",
                transaction.transactionId(), transaction.amount());

        TransactionStatusChangedEvent resultEvent = evaluationService.evaluate(transaction);

        eventProducer.sendMessage(resultEvent);

        log.info("[ANTIFRAUD] Evaluation done transactionId={}, status={}",
                resultEvent.transactionId(), resultEvent.status());

        return ResponseEntity.ok("Event handled successfully!");
    }
}
