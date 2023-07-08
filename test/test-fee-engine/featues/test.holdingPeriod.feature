Feature: FIFO holding period calcuation

  Scenario: Calculate holding periods for transactions from an Excel file
    Given I have read the transactions with purchase and redemption amounts from the Excel file "transactions_simple.xlsx"
    When I calculate the holding periods using the FIFO method
    Then the calculated holding periods should match the expected results from the JSON file "expected_results_simple.json"

  Scenario: Calculate holding periods for complex transactions from an Excel file
    Given I have read the transactions with purchase and redemption amounts from the Excel file "transactions_complex.xlsx"
    When I calculate the holding periods using the FIFO method
    Then the calculated holding periods should match the expected results from the JSON file "expected_results_complex.json"
