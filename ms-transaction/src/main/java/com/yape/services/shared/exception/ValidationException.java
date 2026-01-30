package com.yape.services.shared.exception;

import java.io.Serial;
import lombok.Getter;

/**
 * Exception thrown when input validation fails.
 * Used for invalid parameters, missing required fields, or format errors.
 */
@Getter
public class ValidationException extends BusinessException {

  @Serial
  private static final long serialVersionUID = 1L;

  private final String fieldName;

  /**
   * Constructs a ValidationException with a custom message.
   *
   * @param message the detail message describing the validation error
   */
  public ValidationException(String message) {
    super(ErrorCode.VALIDATION_ERROR, message);
    this.fieldName = null;
  }

  /**
   * Constructs a ValidationException with a specific error code and message.
   *
   * @param errorCode the specific error code
   * @param message   the detail message
   */
  public ValidationException(ErrorCode errorCode, String message) {
    super(errorCode, message);
    this.fieldName = null;
  }

  /**
   * Constructs a ValidationException for a specific field.
   *
   * @param errorCode the specific error code
   * @param fieldName the name of the field that failed validation
   * @param message   the detail message
   */
  public ValidationException(ErrorCode errorCode, String fieldName, String message) {
    super(errorCode, message);
    this.fieldName = fieldName;
  }

}
