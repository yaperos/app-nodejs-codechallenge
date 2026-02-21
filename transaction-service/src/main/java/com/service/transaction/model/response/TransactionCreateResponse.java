package com.service.transaction.model.response;

import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.UUID;

/**
 * <b>Class</b>: TransactionCreateResponse<br/>
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
public class TransactionCreateResponse {

  private UUID transactionId;
  private UUID transactionExternalId;
  private BigDecimal transactionAmount;

}