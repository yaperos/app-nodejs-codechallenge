package com.yape.challenge.adapter.out.mapper;

import com.pe.yape.service.challenge.kafka.avro.ValidateTransactionMessageEvent;
import com.yape.challenge.domain.model.ValidateTransactionEvent;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring",
        injectionStrategy = InjectionStrategy.CONSTRUCTOR,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
public interface AntiFraudMessageMapper {
    ValidateTransactionMessageEvent toValidate(ValidateTransactionEvent validateTransactionEvent);
}
