Feature: Mutual Fund Profit and Loss Calculation

  Scenario: Calculate realized and unrealized P/L after multiple transactions
    Given I am using the "MutualFundService" implementation
    And I have the following transactions:
      | date       | type | units | price |
      | 2023-01-01 | BUY  | 100   | 10    |
      | 2023-02-01 | BUY  | 50    | 12    |
      | 2023-03-01 | SELL | 80    | 15    |
    When the current market price is 16
    Then the realized profit loss should be 250
    And the unrealized profit loss should be 320
