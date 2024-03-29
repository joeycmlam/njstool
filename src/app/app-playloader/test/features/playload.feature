Feature: Excel to JSON conversion

  Scenario Outline: Validate Excel to JSON conversion
    Given I have an Excel file "<excel_file>"
    When I convert the Excel file to JSON
    Then the JSON output should match the expected JSON file "<expect_result>"

    Examples: 
      | excel_file     | expect_result    |
      | sample.01.xlsx | expected.01.json |
