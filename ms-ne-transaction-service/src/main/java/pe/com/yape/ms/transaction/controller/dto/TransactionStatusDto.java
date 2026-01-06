package pe.com.yape.ms.transaction.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para el estado de transacción
 * @author lmarusic
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionStatusDto {
    private String name;
}

