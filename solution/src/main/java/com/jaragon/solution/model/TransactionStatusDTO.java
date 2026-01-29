package com.jaragon.solution.model;

public class TransactionStatusDTO {

  private String name;

  public TransactionStatusDTO(){

  }
  public TransactionStatusDTO(String name) {
    this.name = name;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }
}
