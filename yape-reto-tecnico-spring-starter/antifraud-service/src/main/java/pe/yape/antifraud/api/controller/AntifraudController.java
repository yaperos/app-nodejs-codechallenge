package pe.yape.antifraud.api.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.yape.antifraud.api.dto.AntifraudValidateRequest;
import pe.yape.antifraud.api.dto.AntifraudValidateResponse;
import pe.yape.antifraud.application.AntifraudService;

@RestController
@RequestMapping
public class AntifraudController {

  private final AntifraudService service;

  public AntifraudController(AntifraudService service) {
    this.service = service;
  }

  @PostMapping("/validate")
  public ResponseEntity<AntifraudValidateResponse> validate(@Valid @RequestBody AntifraudValidateRequest request) {
    return ResponseEntity.ok(service.validate(request));
  }
}