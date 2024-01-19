Feature: Validate a transaction
  I want to validate a created transaction

  Scenario: A valid created transaction
    Given the application running
    When the following event is published in "transaction":
      """
      {
        "id": "bd3d3f72-6354-4b27-acb1-bc6ab9469652",
        "type": "transaction.created",
        "occurredOn": "2024-12-10T22:44:51.804Z",
        "aggregateId": "ab7b5035-81b9-4e72-bfc1-f51fa5e03453",
        "attributes": {
          "amount": 275
        }
      }
      """
    Then the application should consume and process the event
    And should publish the following event:
      """
      {
        "id": "3ffb78b7-9290-407c-8af5-b1ff17d942c8",
        "type": "transaction.approved",
        "occurredOn": "2024-12-11T22:44:51.804Z",
        "aggregateId": "ab7b5035-81b9-4e72-bfc1-f51fa5e03453",
        "attributes": {}
      }
      """