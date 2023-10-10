Feature: Create a new transaction
  In order to have transaction in the platform
  As a user with admin permissions
  I want to create a new transaction

  Scenario: A valid non existing transaction
    Given I send a PUT request to "/transactions/e43e0ad1-f403-4275-b961-b3d0d56717cc" with body:
    """
    {
      "accountExternalIdDebit": "14d444bc-a29e-4200-a31c-59875bcb9e51",
      "accountExternalIdCredit": "da2181ca-9ca1-4c3b-93fa-114338253184",
      "tranferTypeId": 2,
      "value": 500
    }
    """
    Then the response status code should be 201
    And the response should be empty

 Scenario: An invalid  transaction
    Given I send a PUT request to "/transactions/e43e0ad1-f403-4275-b961-b3d0d56717cc" with body:
    """
    {
      "accountExternalIdDebit": "14d444bc-a29e-4200-a31c-59875bcb9e51",
      "accountExternalIdCredit": "da2181ca-9ca1-4c3b-93fa-114338253184"
    }
    """
    Then the response status code should be 422
