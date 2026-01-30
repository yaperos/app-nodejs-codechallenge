package com.yape.services.transaction.application.mapper;

import com.yape.services.transaction.domain.model.TransferType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

/**
 * Mapper for TransferType entities using MapStruct.
 */
@Mapper(componentModel = MappingConstants.ComponentModel.JAKARTA_CDI)
public interface TransferTypeMapper {

  /**
   * Converts a domain TransferType model to a GraphQL TransferType model.
   *
   * @param transferType the domain TransferType model
   * @return the GraphQL TransferType model
   */
  @Mapping(target = "transferTypeId",
      expression = "java(String.valueOf(transferType.getTransferTypeId()))")
  @Mapping(target = "name", source = "name")
  com.yape.services.transaction.graphql.model.TransferType toGraphqlModel(
      TransferType transferType);

}
