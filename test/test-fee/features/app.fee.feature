Feature: Fee calculator

  Scenario Outline: sample case
    Given the account current position file "<in-data-file>" and place "<trade-type>" <sell-unit> at "<trade-date>"
    When call the calculator
    Then total fee value is <fee-amt>

    Examples:
    | in-data-file | sell-unit | fund-id | trade-type | trade-date |fee-amt |
    | A00001.xlsx  | 1000      | F033    | SELL       | 2017-10-05  | 10      |

