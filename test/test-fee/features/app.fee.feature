Feature: Fee calculator

  Scenario Outline: sample case
    Given the account current position file "<in-data-file>" and place "<trade-type>" on "<fund-id>" with <sell-unit> unit on "<trade-date>" with "<purchase-date>"
    When call the calculator
    Then total fee value is <fee-amt>

    Examples:
      | in-data-file | sell-unit | fund-id | trade-type | purchase-date | trade-date | fee-amt |
      | A0001.xlsx   | 1000      | F033    | SELL       | 2017-08-01    | 2017-10-05 | 10      |

