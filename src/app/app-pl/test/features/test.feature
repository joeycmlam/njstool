Feature: Mutual Fund Profit and Loss Calculation

  Scenario: Calculate realized and unrealized P/L after 1 subscription
    Given I am using the "MutualFundService" implementation
    And I have the following transactions:
      | date       | type | units | price |
      | 2023-01-01 | BUY  | 100   | 10    |
    When the current market price is 13
    Then the profit and loss should be:
      | attribute            | expected |
      | position             | 100      |
      | bookCost             | 1000     |
      | marketValue          | 1300     |
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
      | position             | 150      |
      | bookCost             | 1650     |
      | realizedProfitLoss   | 0        |
      | unrealizedProfitLoss | 450      |
      | marketValue          | 2100     |

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
      | position             | 70      |
      | bookCost             | 850     |
      | realizedProfitLoss   | 100      |
      | unrealizedProfitLoss | 340      |
      | marketValue          | 1190     |
