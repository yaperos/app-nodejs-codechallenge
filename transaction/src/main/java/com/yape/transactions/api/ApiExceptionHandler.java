package com.yape.transactions.api;

import com.yape.transactions.service.InvalidUuidException;
import com.yape.transactions.service.TransactionNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {

  @ExceptionHandler(TransactionNotFoundException.class)
  public ResponseEntity<Map<String, Object>> notFound(TransactionNotFoundException ex) {
    return ResponseEntity.status(404).body(Map.of("error", ex.getMessage()));
  }

  @ExceptionHandler(InvalidUuidException.class)
  public ResponseEntity<Map<String, Object>> invalidUuid(InvalidUuidException ex) {
    return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, Object>> validation(MethodArgumentNotValidException ex) {
    return ResponseEntity.badRequest().body(Map.of(
        "error", "Validation error",
        "details", ex.getBindingResult().getFieldErrors().stream()
            .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
            .toList()
    ));
  }
}
