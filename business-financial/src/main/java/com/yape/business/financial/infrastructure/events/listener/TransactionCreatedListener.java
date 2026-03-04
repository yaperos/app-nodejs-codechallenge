package com.yape.business.financial.infrastructure.events.listener;

import com.yape.business.financial.infrastructure.events.TransactionEventBus;
import com.yape.business.financial.infrastructure.events.TransactionCreatedEvent;
import com.yape.shared.domain.TransactionData;
import com.yape.business.financial.infrastructure.service.TransactionMessageService;
import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@AllArgsConstructor
public class TransactionCreatedListener {
    private final TransactionEventBus eventBus;
    private final TransactionMessageService messageService;

    @PostConstruct
    public void init() {
        eventBus.asFlux()
                .ofType(TransactionCreatedEvent.class)
                .flatMap(event -> {
                    log.info("[EVENT={}]: {}", event.eventName(), event);
                    return messageService.sendTransactionRequest(TransactionData.builder()
                        .id(event.id())
                        .status(event.status())
                        .value(event.value())
                        .build());
                })
                .subscribe();
    }
}
