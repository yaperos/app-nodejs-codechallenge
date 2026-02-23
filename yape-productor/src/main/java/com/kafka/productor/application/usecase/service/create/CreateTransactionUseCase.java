package com.kafka.productor.application.usecase.service.create;

import java.util.UUID;

import com.kafka.productor.application.usecase.command.CreateTransactionCommand;

public interface CreateTransactionUseCase {
    UUID execute(CreateTransactionCommand command);
}
