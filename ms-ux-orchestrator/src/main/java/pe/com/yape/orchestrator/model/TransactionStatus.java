package pe.com.yape.orchestrator.model;

/**
 * Estados posibles de la transacción
 * 
 * @author Yape Engineering Team
 * @version 1.0.0
 */
public enum TransactionStatus {
    PENDING("pending"),
    APPROVED("approved"),
    REJECTED("rejected");
    
    private final String value;
    
    TransactionStatus(String value) {
        this.value = value;
    }
    
    public String getValue() {
        return value;
    }
    
    public static TransactionStatus fromValue(String value) {
        for (TransactionStatus status : values()) {
            if (status.value.equalsIgnoreCase(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid transaction status: " + value);
    }
}

