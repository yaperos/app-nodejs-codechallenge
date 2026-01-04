package com.yape.challenge.transaction.application.bus;

import com.yape.challenge.transaction.application.handler.QueryHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationContext;
import org.springframework.core.ResolvableType;
import org.springframework.stereotype.Component;

/**
 * Query Bus to dispatch queries to their respective handlers
 */
@Component
@Slf4j
public class QueryBus {

    private final ApplicationContext applicationContext;

    public QueryBus(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    /**
     * Dispatches a query to its corresponding handler
     *
     * @param query Query to dispatch
     * @param <Q>   Query type
     * @param <R>   Response type
     * @return Response from handler
     */
    public <Q, R> R dispatch(Q query) {
        log.debug("Dispatching query: {}", query.getClass().getSimpleName());

        QueryHandler<Q, R> handler = findHandler(query);

        if (handler == null) {
            throw new IllegalStateException("No handler found for query: " + query.getClass().getName());
        }

        return handler.handle(query);
    }

    @SuppressWarnings("unchecked")
    private <Q, R> QueryHandler<Q, R> findHandler(Q query) {
        // Get all QueryHandler beans
        var handlers = applicationContext.getBeansOfType(QueryHandler.class);

        // Find the handler that can handle this query type
        for (var handler : handlers.values()) {
            // Check if this handler can handle the query by examining its generic types
            ResolvableType handlerType = ResolvableType.forClass(handler.getClass()).as(QueryHandler.class);
            ResolvableType[] generics = handlerType.getGenerics();

            if (generics.length == 2) {
                Class<?> queryType = generics[0].resolve();
                if (queryType != null && queryType.isAssignableFrom(query.getClass())) {
                    return handler;
                }
            }
        }

        return null;
    }
}

