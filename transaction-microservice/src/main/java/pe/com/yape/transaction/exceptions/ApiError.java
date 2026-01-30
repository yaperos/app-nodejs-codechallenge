package pe.com.yape.transaction.exceptions;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Map;

@Data
@AllArgsConstructor
public class ApiError {
    private String message;
    private Map<String, String> errors;
}