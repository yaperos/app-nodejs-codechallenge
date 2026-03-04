package com.yape.business.financial.infrastructure.events.command;

import com.yape.business.financial.infrastructure.cache.TransactionCache;
import com.yape.business.financial.infrastructure.events.TransactionCreatedEvent;
import com.yape.business.financial.infrastructure.events.TransactionEventBus;
import com.yape.business.financial.infrastructure.service.EventStoreService;
import com.yape.shared.domain.TransactionStatus;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.util.UUID;

@Slf4j
@Service
@AllArgsConstructor
public class CreateTransactionHandler implements CommandHandler<CreateTransactionCommand> {
    private final TransactionEventBus eventBus;
    private final EventStoreService eventStoreService;
    private final TransactionCache cache;
    private final ObjectMapper mapper;

    @Override
    public void handle(CreateTransactionCommand command) {
        //Validate Command
        var event = createdEvent(command);
        eventStoreService.storeEvent(
                command.getId(), event.eventName(), mapper.writeValueAsString(event))
            .doOnSuccess(
                eventEntity -> {
                    cache.save(event)
                            .doOnSuccess(result -> log.info("Redis saved: {}", result)).subscribe();
                    eventBus.publish(event);
                })
            .doOnError(
                err -> log.warn(err.getMessage()))
            .subscribe();
    }

    private TransactionCreatedEvent createdEvent(CreateTransactionCommand command) {
        return TransactionCreatedEvent.builder()
                .id(command.getId())
                .accountExternalIdDebit(UUID.fromString(command.getAccountExternalIdDebit()))
                .accountExternalIdCredit(UUID.fromString(command.getAccountExternalIdCredit()))
                .transferType("DEBIT")
                .value(command.getValue())
                .status(TransactionStatus.PENDING)
                .build();
    }
}
