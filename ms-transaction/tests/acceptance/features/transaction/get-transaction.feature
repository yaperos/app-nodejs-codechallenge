Feature: Get transaction
  I want to get a transaction

  Scenario: A valid existing transaction
    Given the application running
    And the transaction saved:
      """
      {
        "id": "ce04f166-aa34-4396-8013-cf2c71f8de6d",
        "amount": 150.6,
        "transferType": "2",
        "validationStatus": "approved",
        "createdAt": "2024-11-10T22:44:51.804Z"
      }
      """
    When I send a transaction grpc request to "findOne" with data:
      """
      {
        "id": "ce04f166-aa34-4396-8013-cf2c71f8de6d"
      }
      """
    Then the grpc response code should be 200
    And the grpc response data should be:
      """
      {
        "id": "ce04f166-aa34-4396-8013-cf2c71f8de6d",
        "transferType": {
          "id": "2",
          "name": "EXTERNAL"
        },
        "validationStatus": "approved",
        "amount": 150.6,
        "createdAt": "2024-01-01T22:44:51.804Z"
      }
      """