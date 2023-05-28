Feature: Fee calculator

  Scenario Outline: 2nd redemption within a year
    Given the account "<acctId>" position file "<in-data-file>" and place "<trade-type>" on "<fund-id>" with <sell-unit> unit on "<trade-date>"
    When call the fee with holdings
    Then total fee value is <fee-amt>

    Examples:
      | in-data-file  | acctId | sell-unit | fund-id | trade-type | trade-date | fee-amt |
      | A0001-01.xlsx | A00001 | 30000     | F031    | SELL       | 2019-01-05 | 800     |

  Scenario Outline: first redemption within a year
    Given the account "<acctId>" position file "<in-data-file>" and place "<trade-type>" on "<fund-id>" with <sell-unit> unit on "<trade-date>"
    When call the fee with holdings
    Then total fee value is <fee-amt>

    Examples:
      | in-data-file | acctId | sell-unit | fund-id | trade-type | trade-date | fee-amt |
      | A0001.xlsx   | A00001 | 1000      | F031    | SELL       | 2017-10-05 | 30      |

  Scenario Outline: first redemption
    Given the account "<acctId>" position file "<in-data-file>" and place "<trade-type>" on "<fund-id>" with <sell-unit> unit on "<trade-date>"
    When call the fee with holdings
    Then total fee value is <fee-amt>

    Examples:
      | in-data-file | acctId | sell-unit | fund-id | trade-type | trade-date | fee-amt |
      | A0001.xlsx   | A00001 | 1000      | F031    | SELL       | 2019-10-05 | 20      |
      | A0001.xlsx   | A00001 | 1000      | F031    | SELL       | 2019-07-01 | 20      |
      | A0001.xlsx   | A00001 | 1000      | F031    | SELL       | 2020-10-05 | 10      |
      | A0001.xlsx   | A00001 | 1000      | F031    | SELL       | 2022-10-05 | 0       |


  Scenario Outline: sample case with over 4 years
    Given place "<trade-type>" on "<fund-id>" with <sell-unit> unit on "<trade-date>" with "<purchase-date>"
    When call the calculator
    Then total fee value is <fee-amt>

    Examples:
      | sell-unit | fund-id | trade-type | purchase-date | trade-date | fee-amt |
      | 1000      | F033    | SELL       | 2015-08-01    | 2022-10-05 | 0       |

  Scenario Outline: sample case with over 2 years
    Given place "<trade-type>" on "<fund-id>" with <sell-unit> unit on "<trade-date>" with "<purchase-date>"
    When call the calculator
    Then total fee value is <fee-amt>

    Examples:
      | sell-unit | fund-id | trade-type | purchase-date | trade-date | fee-amt |
      | 1000      | F033    | SELL       | 2017-08-01    | 2019-10-05 | 20      |


  Scenario Outline: sample case with over 1 years
    Given place "<trade-type>" on "<fund-id>" with <sell-unit> unit on "<trade-date>" with "<purchase-date>"
    When call the calculator
    Then total fee value is <fee-amt>

    Examples:
      | sell-unit | fund-id | trade-type | purchase-date | trade-date | fee-amt |
      | 1000      | F033    | SELL       | 2017-09-01    | 2018-10-05 | 30      |


  Scenario Outline: sample case within 1 year
    Given place "<trade-type>" on "<fund-id>" with <sell-unit> unit on "<trade-date>" with "<purchase-date>"
    When call the calculator
    Then total fee value is <fee-amt>

    Examples:
      | sell-unit | fund-id | trade-type | purchase-date | trade-date | fee-amt |
      | 1000      | F033    | SELL       | 2017-10-01    | 2017-12-01 | 30      |

