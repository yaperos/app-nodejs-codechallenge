package com.service.antifraud.integration.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.UUID;

/**
 * <b>Class</b>: TransactionCreatedEvent<br/>
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
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionCreatedEvent {

  private UUID transactionExternalId;
  private BigDecimal value;

}