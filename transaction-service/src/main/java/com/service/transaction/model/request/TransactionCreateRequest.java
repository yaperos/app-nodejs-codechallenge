package com.service.transaction.model.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.UUID;

/**
 * <b>Class</b>: TransactionCreateRequest<br/>
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
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionCreateRequest {

  @NotNull(message = "accountExternalIdDebit es requerido")
  private UUID accountExternalIdDebit;

  @NotNull(message = "accountExternalIdCredit es requerido")
  private UUID accountExternalIdCredit;

  @NotNull(message = "tranferTypeId es requerido")
  @Positive(message = "tranferTypeId debe ser mayor a 0")
  private Integer transferTypeId;

  @NotNull(message = "value es requerido")
  @Positive(message = "value debe ser mayor a 0")
  private BigDecimal value;

}