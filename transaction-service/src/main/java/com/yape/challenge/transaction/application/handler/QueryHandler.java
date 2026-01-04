package com.yape.challenge.transaction.application.handler;

/**
 * Generic Query Handler interface
 * @param <Q> Query type
 * @param <R> Response type
 */
public interface QueryHandler<Q, R> {
    R handle(Q query);
}

