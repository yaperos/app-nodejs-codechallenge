package com.transaction.app.infrastructure.mapper;

import com.transaction.app.domain.model.TransactionModel;
import com.transaction.app.infrastructure.persistence.entity.TransactionEntity;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TransactionMapper {


    @Mapping(target = "transactionExternalId", source = "transactionExternalId")
    @Mapping(target = "accountExternalIdDebit", source = "accountExternalIdDebit")
    @Mapping(target = "accountExternalIdCredit", source = "accountExternalIdCredit")
    @Mapping(target = "tranferTypeId", source = "tranferTypeId")
    @Mapping(target = "value", source = "value")
    @Mapping(target = "status", source = "status")
    @Mapping(target = "createdAt", source = "createdAt")
    TransactionEntity toEntity(TransactionModel model);

    @InheritInverseConfiguration
    TransactionModel toModel(TransactionEntity entity);


}
