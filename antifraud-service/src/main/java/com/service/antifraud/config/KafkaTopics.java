package com.service.antifraud.config;

/**
 * <b>Class</b>: KafkaTopics<br/>
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
public final class KafkaTopics {

  private KafkaTopics() {}

  public static final String TRANSACTION_CREATED = "transaction.created";
  public static final String TRANSACTION_STATUS_UPDATED = "transaction.status.updated";

}