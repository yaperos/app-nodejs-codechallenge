Feature: Update a rejected transaction
  I want to update a rejected transaction

  Scenario: A pending transaction
    Given the application running
    And the transaction saved:
      """
      {
        "id": "cfd11766-7c0b-434f-9bcb-3511a203de8e",
        "validationStatus": "pending"
      }
      """
    When the following event is published in "anti-fraud":
      """
      {
        "id": "410071b1-6759-4a3b-af39-002057e8f576",
        "type": "transaction.rejected",
        "occurredOn": "2024-11-10T22:45:51.804Z",
        "aggregateId": "cfd11766-7c0b-434f-9bcb-3511a203de8e",
        "attributes": {}
      }
      """
    Then the application should consume and process the event
    And the transaction saved should be:
      """
      {
        "id": "cfd11766-7c0b-434f-9bcb-3511a203de8e",
        "validationStatus": "rejected"
      }
      """