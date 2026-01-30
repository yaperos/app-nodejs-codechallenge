package com.yape.services.shared.exception;

import java.io.Serial;
import lombok.Getter;

/**
 * Base exception for business-related errors in the application.
 * All custom exceptions should extend this class to ensure consistent error handling.
 */
@Getter
public class BusinessException extends RuntimeException {

  @Serial
  private static final long serialVersionUID = 1L;

  private final ErrorCode errorCode;

  /**
   * Constructs a new BusinessException with the specified error code and message.
   *
   * @param errorCode the error code representing the type of error
   * @param message   the detail message
   */
  public BusinessException(ErrorCode errorCode, String message) {
    super(message);
    this.errorCode = errorCode;
  }

  /**
   * Constructs a new BusinessException with the specified error code, message, and cause.
   *
   * @param errorCode the error code representing the type of error
   * @param message   the detail message
   * @param cause     the cause of the exception
   */
  public BusinessException(ErrorCode errorCode, String message, Throwable cause) {
    super(message, cause);
    this.errorCode = errorCode;
  }

  /**
   * Constructs a new BusinessException with the specified error code using its default message.
   *
   * @param errorCode the error code representing the type of error
   */
  public BusinessException(ErrorCode errorCode) {
    super(errorCode.getDefaultMessage());
    this.errorCode = errorCode;
  }

}
