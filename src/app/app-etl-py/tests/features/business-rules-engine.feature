Feature: Business Rules Engine
  As a financial data processor
  I want to categorize securities based on business rules
  So that I can properly classify different types of investments

  Scenario Outline: Categorize securities based on country and security type
    Given I have a business rules engine initialized
    When I evaluate a record with country "<country>" and security type "<security_type>"
    Then the record should be categorized as "<expected_category>"

    Examples:
      | country | security_type | expected_category      |
      | HK      | Equity        | onshore_equity         |
      | HK      | ETF           | onshore_equity         |
      | US      | Equity        | offshore_equity        |
      | JP      | ETF           | offshore_equity        |
      | HK      | Bond          | onshore_fixed_income   |
      | US      | Bond          | offshore_fixed_income  |
      | JP      | Currency      | currency               |
      | DE      | Commodity     | commodity              |
      | CN      | REIT          | others                 |
