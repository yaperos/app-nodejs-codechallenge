Feature: Update an approved transaction
  I want to update an approved transaction

  Scenario: A pending transaction
    Given the application running
    And the transaction saved:
      """
      {
        "id": "01ee36d8-480c-4c20-aae8-217947d2c42a",
        "validationStatus": "pending"
      }
      """
    When the following event is published in "anti-fraud":
      """
      {
        "id": "9eff251c-c49d-43a2-98a5-9f0a5fe0de3a",
        "type": "transaction.approved",
        "occurredOn": "2024-11-10T22:45:51.804Z",
        "aggregateId": "01ee36d8-480c-4c20-aae8-217947d2c42a",
        "attributes": {}
      }
      """
    Then the application should consume and process the event
    And the transaction saved should be:
      """
      {
        "id": "01ee36d8-480c-4c20-aae8-217947d2c42a",
        "validationStatus": "approved"
      }
      """