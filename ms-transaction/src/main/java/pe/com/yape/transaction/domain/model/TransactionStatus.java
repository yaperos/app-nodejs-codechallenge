package pe.com.yape.transaction.domain.model;

public enum TransactionStatus {
    PENDING("pending"),
    APPROVED("approved"),
    REJECTED("rejected");

    private final String name;

    TransactionStatus(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public static TransactionStatus fromName(String name) {
        for (TransactionStatus status : values()) {
            if (status.name.equalsIgnoreCase(name)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid transaction status: " + name);
    }
}
