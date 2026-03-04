package com.yape.business.financial.infrastructure.events.command;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class CommandBus {
    private final CreateTransactionHandler createTransactionHandler;
    private final UpdateTransactionStatusHandler updateTransactionHandler;

    public void dispatch(CommandInterface baseCommand) {
        switch (baseCommand) {
            case CreateTransactionCommand command -> createTransactionHandler.handle(command);
            case UpdateTransactionStatusCommand command -> updateTransactionHandler.handle(command);
            default -> throw new IllegalStateException("Unexpected value: " + baseCommand);
        }
    }
}
