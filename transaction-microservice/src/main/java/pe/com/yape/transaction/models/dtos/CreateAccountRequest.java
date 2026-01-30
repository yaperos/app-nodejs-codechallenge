package pe.com.yape.transaction.models.dtos;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Builder
@Data
public class CreateAccountRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotNull(message = "Initial balance is required")
    @DecimalMin(
            value = "0.00",
            inclusive = true,
            message = "Initial balance must be greater than or equal to 0.00"
    )
    private BigDecimal initialBalance;

}