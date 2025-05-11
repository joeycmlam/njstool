Feature: Mutual Fund Profit and Loss Calculation by average price

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

  Scenario: Calculate realized and unrealized P/L after 2 subscriptions from excel
    Given I am using the "MutualFundService" implementation
    And I have the transactions from the Excel file "TestCase.xlsx" and worksheet "case2"
    When the current market price is 14
    Then the profit and loss should be:
      | attribute            | expected |
      | position             | 150      |
      | bookCost             | 1650     |
      | realizedProfitLoss   | 0        |
      | unrealizedProfitLoss | 450      |
      | marketValue          | 2100     |

  Scenario: case 3: Calculate realized and unrealized P/L after multiple transactions with FIFO
    Given I am using the "MutualFundService" implementation
    And I have the following transactions:
      | date       | type | units | price |
      | 2023-01-01 | BUY  | 100   | 10    |
      | 2023-02-01 | BUY  | 50    | 13    |
      | 2023-03-01 | SELL | 80    | 15    |
    When the current market price is 17
    Then the profit and loss should be:
      | attribute            | expected |
      | position             | 70       |
      | bookCost             | 850      |
      | marketValue          | 1190     |
      | realizedProfitLoss   | 400      |
      | unrealizedProfitLoss | 340      |

  Scenario: Calculate realized and unrealized P/L after multiple transactions
    Given I am using the "MutualFundService" implementation
    And I have the transactions from the Excel file "TestCase.xlsx" and worksheet "case4"
    When the current market price is 9
    Then the profit and loss should be:
      | attribute            | expected |
      | position             | 80       |
      | bookCost             | 1190     |
      | marketValue          | 720      |
      | realizedProfitLoss   | -470     |
      | unrealizedProfitLoss | 380      |
