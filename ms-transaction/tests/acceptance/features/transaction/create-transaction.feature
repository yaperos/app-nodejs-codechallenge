Feature: Create a new transaction
  I want to create a new transaction

  Scenario: A valid unexisting transaction
    Given the application running
    When I send a transaction grpc request to "create" with data:
    """
    {
      "id": "8e13d15e-4210-4838-a345-f7dba1ba2801",
      "creditAccountExternalId": "b728cfc2-ada8-4abe-8635-742606347a65",
      "debitAccountExternalId": "0b2d4e66-3d51-4589-9d7e-a54b9b803352",
      "amount": 500.00,
      "transferType": "1"
    }
    """
    Then the grpc response code should be 201
    And the grpc response data should be:
    """
    {
      "id": "8e13d15e-4210-4838-a345-f7dba1ba2801",
      "amount": 500.00,
      "transferType": {
        "id": "1",
        "name": "WITHDRAWAL"
      },
      "validationStatus": "pending",
      "createdAt": "2024-12-10T22:44:51.804Z"
    }
    """