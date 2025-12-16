package com.yape.challenge.adapter.out.messaging.mapper;

import com.pe.yape.service.challenge.kafka.avro.CreatedTransactionMessageEvent;
import com.yape.challenge.domain.model.CreateTransactionEvent;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring",
        injectionStrategy = InjectionStrategy.CONSTRUCTOR,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
public interface TransactionMessageMapper {
    CreatedTransactionMessageEvent toMapCreatedTransactionEvent(CreateTransactionEvent event);
}
