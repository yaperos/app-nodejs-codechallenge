package com.yape.services.shared.exception;

import java.io.Serial;
import lombok.Getter;

/**
 * Exception thrown when a requested resource cannot be found.
 * Used for entities that don't exist in the database or cache.
 */
@Getter
public class ResourceNotFoundException extends BusinessException {

  @Serial
  private static final long serialVersionUID = 1L;

  private final String resourceType;
  private final String resourceId;

  /**
   * Constructs a ResourceNotFoundException with a custom message.
   *
   * @param message the detail message
   */
  public ResourceNotFoundException(String message) {
    super(ErrorCode.RESOURCE_NOT_FOUND, message);
    this.resourceType = null;
    this.resourceId = null;
  }

  /**
   * Constructs a ResourceNotFoundException for a specific resource.
   *
   * @param errorCode    the specific error code
   * @param resourceType the type of resource not found
   * @param resourceId   the identifier of the resource
   */
  public ResourceNotFoundException(ErrorCode errorCode, String resourceType, String resourceId) {
    super(errorCode, String.format("%s not found with ID: %s", resourceType, resourceId));
    this.resourceType = resourceType;
    this.resourceId = resourceId;
  }

  /**
   * Constructs a ResourceNotFoundException with a specific error code and message.
   *
   * @param errorCode the specific error code
   * @param message   the detail message
   */
  public ResourceNotFoundException(ErrorCode errorCode, String message) {
    super(errorCode, message);
    this.resourceType = null;
    this.resourceId = null;
  }

}
