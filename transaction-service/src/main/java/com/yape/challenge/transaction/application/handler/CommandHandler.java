package com.yape.challenge.transaction.application.handler;

/**
 * Generic Command Handler interface
 * @param <C> Command type
 * @param <R> Response type
 */
public interface CommandHandler<C, R> {
    R handle(C command);
}
