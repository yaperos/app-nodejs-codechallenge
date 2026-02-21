package com.service.antifraud.model.enums;

import lombok.Getter;

/**
 * <b>Class</b>: TransactionStatusEnum<br/>
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
public enum TransactionStatusEnum {

  PENDING("Pending"),
  APPROVED("Approved"),
  REJECTED("Rejected");

  private final String value;

  TransactionStatusEnum(String value) {
    this.value = value;
  }

}