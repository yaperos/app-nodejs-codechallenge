package com.yape.challenge.transaction.application.bus;

import com.yape.challenge.transaction.application.handler.CommandHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationContext;
import org.springframework.core.ResolvableType;
import org.springframework.stereotype.Component;

/**
 * Command Bus to dispatch commands to their respective handlers
 */
@Component
@Slf4j
public class CommandBus {

    private final ApplicationContext applicationContext;

    public CommandBus(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    /**
     * Dispatches a command to its corresponding handler
     * @param command Command to dispatch
     * @param <C> Command type
     * @param <R> Response type
     * @return Response from handler
     */
    public <C, R> R dispatch(C command) {
        log.debug("Dispatching command: {}", command.getClass().getSimpleName());

        CommandHandler<C, R> handler = findHandler(command);

        if (handler == null) {
            throw new IllegalStateException("No handler found for command: " + command.getClass().getName());
        }

        return handler.handle(command);
    }

    @SuppressWarnings("unchecked")
    private <C, R> CommandHandler<C, R> findHandler(C command) {
        // Get all CommandHandler beans
        var handlers = applicationContext.getBeansOfType(CommandHandler.class);

        CommandHandler<C, R> foundHandler = null;

        for (CommandHandler<?, ?> handler : handlers.values()) {
            // Check if this handler can handle the command by examining its generic type
            ResolvableType handlerType = ResolvableType.forClass(handler.getClass()).as(CommandHandler.class);
            ResolvableType[] generics = handlerType.getGenerics();

            if (generics.length == 2) {
                Class<?> commandType = generics[0].resolve();
                if (commandType != null && commandType.isAssignableFrom(command.getClass())) {
                    if (foundHandler != null) {
                        throw new IllegalStateException("Multiple handlers found for command: " + command.getClass().getName());
                    }
                    foundHandler = (CommandHandler<C, R>) handler;
                }
            }
        }

        return foundHandler;
    }
}
