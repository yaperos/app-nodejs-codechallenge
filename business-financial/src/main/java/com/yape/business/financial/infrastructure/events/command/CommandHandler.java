package com.yape.business.financial.infrastructure.events.command;

public interface CommandHandler<T> {
    void handle(T command);
}
