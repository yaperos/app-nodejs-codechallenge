package pe.com.yape.ms.transaction.model.domain;

/**
 * Estado de una transacción en el sistema
 * 
 * @author lmarusic
 * @version 1.0.0
 */
public enum TransactionStatus {
    /**
     * Transacción creada pero pendiente de validación anti-fraude
     */
    PENDING("pending"),
    
    /**
     * Transacción aprobada por el motor anti-fraude
     */
    APPROVED("approved"),
    
    /**
     * Transacción rechazada por el motor anti-fraude
     */
    REJECTED("rejected");
    
    private final String value;
    
    TransactionStatus(String value) {
        this.value = value;
    }
    
    public String getValue() {
        return value;
    }
    
    /**
     * Obtiene el enum desde su valor string
     * 
     * @param value valor del estado
     * @return enum correspondiente
     * @throws IllegalArgumentException si el valor no es válido
     */
    public static TransactionStatus fromValue(String value) {
        for (TransactionStatus status : values()) {
            if (status.value.equalsIgnoreCase(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid transaction status: " + value);
    }
}

