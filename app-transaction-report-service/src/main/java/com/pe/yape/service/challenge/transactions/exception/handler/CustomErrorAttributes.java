package com.pe.yape.service.challenge.transactions.exception.handler;

import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.reactive.error.DefaultErrorAttributes;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebExchangeBindException;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.server.ServerWebInputException;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
public class CustomErrorAttributes extends DefaultErrorAttributes {

    @Override
    public Map<String, Object> getErrorAttributes(ServerRequest request, ErrorAttributeOptions options) {
        Throwable error = getError(request);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("path", request.path());
        body.put("status", getStatus(error));
        body.put("message", buildMessage(error));
        body.put("errors", extractValidationErrors(error));

        return body;
    }

    private int getStatus(Throwable error) {
        if (error instanceof ServerWebInputException ex) {
            return ex.getStatusCode().value();
        }
        else if (error instanceof ApiException) {
            return ((ApiException) error).getCode();
        }
        return 500;
    }

    private String buildMessage(Throwable error) {
        if (error instanceof ServerWebInputException) {
            return "Existen errores de validación";
        }
        else if (error instanceof ApiException) {
            return error.getMessage();
        }
        return error.getMessage();
    }

    private List<Map<String, String>> extractValidationErrors(Throwable error) {
        if (error instanceof WebExchangeBindException ex) {
            return ex.getFieldErrors().stream()
                    .map(er -> Map.of(
                            "field", er.getField(),
                            "message", er.getDefaultMessage()
                    )).toList();
        }
        return null;
    }
}
