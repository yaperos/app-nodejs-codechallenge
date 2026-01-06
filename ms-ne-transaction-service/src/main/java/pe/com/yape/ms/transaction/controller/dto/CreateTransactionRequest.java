package pe.com.yape.ms.transaction.controller.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Objeto de request para crear una transaccion
 *
 * @author lmarusic
 * @version 1.0.0
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTransactionRequest {
    
    @NotNull(message = "Account external ID debit is required")
    private UUID accountExternalIdDebit;
    
    @NotNull(message = "Account external ID credit is required")
    private UUID accountExternalIdCredit;
    
    @NotNull(message = "Transfer type ID is required")
    private Integer tranferTypeId;
    
    @NotNull(message = "Value is required")
    @DecimalMin(value = "0.01", message = "Value must be greater than zero")
    private BigDecimal value;
}

