package pe.com.yape.transaction.models.dtos;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Builder
@Data
public class TransactionResponse {

    private UUID transactionExternalId;
    private String transactionStatus;
    private BigDecimal value;
    private LocalDateTime createdAt;

}
