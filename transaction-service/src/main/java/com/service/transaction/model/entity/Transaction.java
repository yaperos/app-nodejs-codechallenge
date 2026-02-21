package com.service.transaction.model.entity;

import com.service.transaction.model.enums.TransactionStatusEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * <b>Class</b>: Transaction<br/>
 * Copyright: &copy; 2026.<br/>
 * Company: Yape.<br/>
 *
 * <u>Developed by</u>: <br/>
 * <ul>
 *     <li>Felipe Rosado</li>
 *     <li>February 21, 2026 Creaci&oacute;n de Clase.</li>
 * </ul>
 * @version 1.0
 */
@Getter
@Setter
@Table(schema = "public", name = "transactions")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

  @Id
  @Column("id")
  private UUID id;

  @Builder.Default
  @Column("transaction_external_id")
  private UUID transactionExternalId = UUID.randomUUID();

  @Column("account_external_id_debit")
  private UUID accountExternalIdDebit;

  @Column("account_external_id_credit")
  private UUID accountExternalIdCredit;

  @Column("transfer_type_id")
  private int transferTypeId;

  @Column("value")
  private BigDecimal value;

  @Builder.Default
  @Column("status")
  private TransactionStatusEnum status = TransactionStatusEnum.PENDING;

  @Column("created_at")
  private LocalDateTime createdAt;

  @Column("updated_at")
  private LocalDateTime updatedAt;

}