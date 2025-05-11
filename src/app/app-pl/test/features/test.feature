Feature: Mutual Fund Profit and Loss Calculation

  Scenario: Calculate realized and unrealized P/L after 1 subscription
    Given I am using the "MutualFundService" implementation
    And I have the following transactions:
      | date       | type | units | price |
      | 2023-01-01 | BUY  | 100   | 10    |
    When the current market price is 13
    Then the profit and loss should be:
      | attribute            | expected |
      | realizedProfitLoss   | 0        |
      | unrealizedProfitLoss | 300      |

  Scenario: Calculate realized and unrealized P/L after 2 subscriptions
    Given I am using the "MutualFundService" implementation
    And I have the following transactions:
      | date       | type | units | price |
      | 2023-01-01 | BUY  | 100   | 10    |
      | 2023-02-01 | BUY  | 50    | 13    |
    When the current market price is 14
    Then the profit and loss should be:
      | attribute            | expected |
      | realizedProfitLoss   | 0        |
      | unrealizedProfitLoss | 450      |

  Scenario: Calculate realized and unrealized P/L after multiple transactions
    Given I am using the "MutualFundService" implementation
    And I have the following transactions:
      | date       | type | units | price |
      | 2023-01-01 | BUY  | 100   | 10    |
      | 2023-02-01 | BUY  | 50    | 13    |
      | 2023-03-01 | SELL | 80    | 15    |
    When the current market price is 17
    Then the profit and loss should be:
      | attribute            | expected |
      | realizedProfitLoss   | 100      |
      | unrealizedProfitLoss | 340      |

  Scenario: Calculate realized and unrealized P/L after multiple transactions for different price
    Given I am using the "MutualFundService" implementation
    And I have the following transactions:
      | date       | type | units | price |
      | 2023-01-01 | BUY  | 100   | 10    |
      | 2023-02-01 | BUY  | 50    | 13    |
      | 2023-03-01 | SELL | 80    | 15    |
    When the current market price is 16
    Then the profit and loss should be:
      | attribute            | expected |
      | realizedProfitLoss   | 100      |
      | unrealizedProfitLoss | 270      |

  Scenario: Calculate realized and lost unrealized P/L after 2 subscription, 1 partial redemption and 1 subscription again
    Given I am using the "MutualFundService" implementation
    And I have the following transactions:
      | date       | type | units | price |
      | 2023-01-01 | BUY  | 100   | 10    |
      | 2023-02-01 | BUY  | 50    | 12    |
      | 2023-03-01 | SELL | 80    | 15    |
      | 2023-04-01 | BUY  | 50    | 16    |
    When the current market price is 13
    Then the profit and loss should be:
      | attribute            | expected |
      | realizedProfitLoss   | 100      |
      | unrealizedProfitLoss | -90      |


  Scenario: Calculate realized lost and lost unrealized P/L after multiple transactions
    Given I am using the "MutualFundService" implementation
    And I have the following transactions:
      | date       | type | units | price |
      | 2023-01-01 | BUY  | 100   | 10    |
      | 2023-02-01 | BUY  | 50    | 12    |
      | 2023-03-01 | SELL | 80    | 15    |
      | 2023-04-01 | BUY  | 50    | 16    |
      | 2023-05-01 | SELL | 40    | 11    |
    When the current market price is 9
    Then the profit and loss should be:
      | attribute            | expected |
      | realizedProfitLoss   | -20      |
      | unrealizedProfitLoss | -470     |
