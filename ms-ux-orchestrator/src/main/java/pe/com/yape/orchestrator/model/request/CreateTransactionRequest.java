package pe.com.yape.orchestrator.model.request;

import java.math.BigDecimal;
import java.util.UUID;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Objeto de request para crear la transaccion
 *
 * @author lmarusic
 * @version 1.0.0
 */
@Data
@Builder
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

