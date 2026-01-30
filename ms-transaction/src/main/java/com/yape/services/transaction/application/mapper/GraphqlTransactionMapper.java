package com.yape.services.transaction.application.mapper;

import com.yape.services.transaction.domain.model.Transaction;
import com.yape.services.transaction.domain.model.TransactionStatus;
import com.yape.services.transaction.domain.model.TransferType;
import com.yape.services.transaction.graphql.model.TransactionType;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.Named;

/**
 * Mapper for converting domain Transaction to GraphQL Transaction model using MapStruct.
 */
@Mapper(componentModel = MappingConstants.ComponentModel.JAKARTA_CDI)
public interface GraphqlTransactionMapper {

  /**
   * Maps Transaction domain model to GraphQL Transaction response.
   *
   * @param tx           the domain transaction
   * @param transferType the transfer type
   * @param txStatus     the transaction status
   * @return the GraphQL transaction model
   */
  @Mapping(target = "transactionExternalId",
      source = "tx.transactionExternalId",
      qualifiedByName = "uuidToString")
  @Mapping(target = "transactionType",
      source = "transferType",
      qualifiedByName = "toTransactionType")
  @Mapping(target = "transactionStatus",
      source = "txStatus",
      qualifiedByName = "toGraphqlStatus")
  @Mapping(target = "value",
      source = "tx.value",
      qualifiedByName = "bigDecimalToString")
  @Mapping(target = "createdAt",
      source = "tx.createdAt",
      qualifiedByName = "formatDate")
  com.yape.services.transaction.graphql.model.Transaction toGraphqlModel(
      Transaction tx,
      TransferType transferType,
      TransactionStatus txStatus
  );

  /**
   * Converts UUID to String.
   */
  @Named("uuidToString")
  default String uuidToString(UUID uuid) {
    return uuid != null ? uuid.toString() : null;
  }

  /**
   * Converts BigDecimal to String.
   */
  @Named("bigDecimalToString")
  default String bigDecimalToString(java.math.BigDecimal value) {
    return value != null ? value.toPlainString() : null;
  }

  /**
   * Formats LocalDateTime to ISO date string.
   */
  @Named("formatDate")
  default String formatDate(LocalDateTime dateTime) {
    return dateTime != null ? dateTime.format(DateTimeFormatter.ISO_DATE) : null;
  }

  /**
   * Converts TransferType to GraphQL TransactionType.
   */
  @Named("toTransactionType")
  default TransactionType toTransactionType(TransferType transferType) {
    if (transferType == null) {
      return null;
    }
    return TransactionType.builder()
        .setName(transferType.getName())
        .build();
  }

  /**
   * Converts domain TransactionStatus to GraphQL TransactionStatus.
   */
  @Named("toGraphqlStatus")
  default com.yape.services.transaction.graphql.model.TransactionStatus toGraphqlStatus(
      TransactionStatus txStatus) {
    if (txStatus == null) {
      return null;
    }
    return com.yape.services.transaction.graphql.model.TransactionStatus.builder()
        .setName(txStatus.getName())
        .build();
  }

}
