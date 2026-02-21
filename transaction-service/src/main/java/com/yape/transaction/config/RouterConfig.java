package com.yape.transaction.config;

import com.yape.transaction.handler.TransactionHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.server.RequestPredicates;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

@Configuration
public class RouterConfig {

    @Bean
    public RouterFunction<ServerResponse> transactionRoutes(TransactionHandler handler) {
        return RouterFunctions.route()
                .nest(RequestPredicates.path("/api/v1/transactions"), builder -> builder
                        .POST("",          handler::createTransaction)
                        .GET("/{id}",      handler::getTransaction)
                        .GET("/account/{accountId}", handler::getAccountTransactions)
                )
                .build();
    }
}