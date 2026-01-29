package com.jaragon.solution.model;

public class TransactionTypeDTO {
  private String name;

  public TransactionTypeDTO(){

  }
  public TransactionTypeDTO(String name) {
    this.name = name;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }
}
