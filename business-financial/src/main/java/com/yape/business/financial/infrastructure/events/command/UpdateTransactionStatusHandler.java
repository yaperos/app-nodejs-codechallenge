package com.yape.business.financial.infrastructure.events.command;

import com.yape.business.financial.infrastructure.events.TransactionEventBus;
import com.yape.business.financial.infrastructure.events.TransactionUpdatedEvent;
import com.yape.business.financial.infrastructure.service.EventStoreService;
import com.yape.shared.domain.TransactionStatus;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.util.Map;

import static com.yape.shared.domain.TransactionStatus.PENDING;

@Slf4j
@Service
@AllArgsConstructor
public class UpdateTransactionStatusHandler implements CommandHandler<UpdateTransactionStatusCommand> {
    private final EventStoreService eventStoreService;
    private final TransactionEventBus eventBus;
    private final ObjectMapper mapper;

    @Override
    public void handle(UpdateTransactionStatusCommand command) {
        // 4. Lanzar Evento
        eventStoreService.findById(command.getId())
            .handle((eventEntity, sink) -> {
                try {
                    // 2. Validar y Transformar Payload
                    Map<String, String> payload = mapper.readValue(
                            eventEntity.getPayload().asString(), new TypeReference<>() {});

                    // Modificar el payload con el nuevo estado
                    String status = payload.get("status");
                    if(!PENDING.equals(TransactionStatus.valueOf(status))) {
                        sink.error(new Exception("Transaction already completed with status: "+ status));
                        return;
                    }
                    // Actualizar la entidad
                    sink.next(eventFrom(command));
                } catch (Exception e) {
                    sink.error(new RuntimeException("Error processing payload for transaction " + command.getId(), e));
                }
            })
            .flatMap((eve) -> {
                TransactionUpdatedEvent event = (TransactionUpdatedEvent) eve;
                return eventStoreService.storeEvent(event.id(), event.eventName(), mapper.writeValueAsString(event));
            }) // 3. Guardar en EventStore
            .doOnSuccess(eventEntity -> {
                eventBus.publish(eventFrom(command));
            })
            .subscribe(
                event -> log.debug("Transaction updated successfully: {}", event.getId()),
                error -> log.error("Failed to update transaction: {}", command.getId(), error)
            );
    }
    
    private TransactionUpdatedEvent eventFrom(UpdateTransactionStatusCommand command) {
        return TransactionUpdatedEvent.builder()
            .id(command.getId())
            .status(command.getStatus())
            .build();
    }
}
