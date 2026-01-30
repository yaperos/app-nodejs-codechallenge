package com.yape.services.transaction.application.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

import com.yape.services.transaction.domain.model.TransactionStatus;
import com.yape.services.transaction.domain.model.TransferType;
import com.yape.services.transaction.graphql.model.TransactionType;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.stream.Stream;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

@DisplayName("GraphqlTransactionMapper")
class GraphqlTransactionMapperTest {

  private GraphqlTransactionMapper mapper;

  @BeforeEach
  void setUp() {
    mapper = new GraphqlTransactionMapperImpl();
  }

  @Test
  @DisplayName("should convert UUID to string")
  void shouldConvertUuidToString() {
    // Arrange
    UUID uuid = UUID.fromString("123e4567-e89b-12d3-a456-426614174000");

    // Act
    String result = mapper.uuidToString(uuid);

    // Assert
    assertEquals("123e4567-e89b-12d3-a456-426614174000", result);
  }

  @Test
  @DisplayName("should return null for null UUID")
  void shouldReturnNullForNullUuid() {
    // Act
    String result = mapper.uuidToString(null);

    // Assert
    assertNull(result);
  }

  @ParameterizedTest(name = "{index} => value={0}, expected={1}")
  @MethodSource("bigDecimalToStringProvider")
  @DisplayName("should convert BigDecimal to string (parameterized)")
  void shouldConvertBigDecimalToString(BigDecimal value, String expected) {
    // Act
    String result = mapper.bigDecimalToString(value);
    // Assert
    assertEquals(expected, result);
  }

  static Stream<Arguments> bigDecimalToStringProvider() {
    return Stream.of(
        Arguments.of(new BigDecimal("1234.56"), "1234.56"),
        Arguments.of(new BigDecimal("999999999999.99"), "999999999999.99"),
        Arguments.of(null, null),
        Arguments.of(new BigDecimal("1000"), "1000")
    );
  }

  @Test
  @DisplayName("should format LocalDateTime to ISO date")
  void shouldFormatLocalDateTimeToIsoDate() {
    // Arrange
    LocalDateTime dateTime = LocalDateTime.of(2024, 6, 15, 10, 30, 45);

    // Act
    String result = mapper.formatDate(dateTime);

    // Assert
    assertEquals("2024-06-15", result);
  }

  @Test
  @DisplayName("should return null for null LocalDateTime")
  void shouldReturnNullForNullLocalDateTime() {
    // Act
    String result = mapper.formatDate(null);

    // Assert
    assertNull(result);
  }

  @Test
  @DisplayName("should format date with single digit month and day")
  void shouldFormatDateWithSingleDigitMonthAndDay() {
    // Arrange
    LocalDateTime dateTime = LocalDateTime.of(2024, 1, 5, 8, 15);

    // Act
    String result = mapper.formatDate(dateTime);

    // Assert
    assertEquals("2024-01-05", result);
  }

  @Test
  @DisplayName("should convert TransferType to TransactionType")
  void shouldConvertTransferTypeToTransactionType() {
    // Arrange
    TransferType transferType = TransferType.builder()
        .transferTypeId(1)
        .code("INTERNAL")
        .name("Internal Transfer")
        .build();

    // Act
    TransactionType result = mapper.toTransactionType(transferType);

    // Assert
    assertNotNull(result);
    assertEquals("Internal Transfer", result.getName());
  }

  @Test
  @DisplayName("should return null for null TransferType")
  void shouldReturnNullForNullTransferType() {
    // Act
    TransactionType result = mapper.toTransactionType(null);

    // Assert
    assertNull(result);
  }

  @Test
  @DisplayName("should convert domain TransactionStatus to GraphQL TransactionStatus")
  void shouldConvertDomainStatusToGraphqlStatus() {
    // Arrange
    TransactionStatus txStatus = TransactionStatus.builder()
        .transactionStatusId(1)
        .code("PENDING")
        .name("Pending")
        .build();

    // Act
    com.yape.services.transaction.graphql.model.TransactionStatus result =
        mapper.toGraphqlStatus(txStatus);

    // Assert
    assertNotNull(result);
    assertEquals("Pending", result.getName());
  }

  @Test
  @DisplayName("should return null for null TransactionStatus")
  void shouldReturnNullForNullTransactionStatus() {
    // Act
    com.yape.services.transaction.graphql.model.TransactionStatus result =
        mapper.toGraphqlStatus(null);

    // Assert
    assertNull(result);
  }

}
