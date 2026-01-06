package pe.com.yape.antifraud.domain.model;


public enum TransactionStatus {
    APPROVED("approved"),
    REJECTED("rejected");

    private final String name;


    TransactionStatus(String name){
        this.name = name;
    }

    public String getName(){
        return name;
    }

}
