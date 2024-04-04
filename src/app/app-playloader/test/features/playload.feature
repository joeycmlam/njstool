Feature: Excel to JSON conversion

  Scenario Outline: Validate Excel to JSON conversion
    Given I have an Excel file "<excel_file>" and "<config_file>"
    When I convert the Excel file to JSON
    Then the JSON output should match the expected JSON file "<expect_result>"

    Examples: 
      | excel_file     | expect_result    | config_file |
      | sample.01.xlsx | expected.01.json | config.json |
      | sample.02.xlsx | expected.02.json | config.json |
      | sample.03.xlsx | expected.03.json | config.json |

  Scenario Outline: Validate Excel to JSON conversion for boolean and formula
    Given I have an Excel file "<excel_file>" and "<config_file>"
    When I convert the Excel file to JSON
    Then the JSON output should match the expected JSON file "<expect_result>"

    Examples: 
      | excel_file     | expect_result    | config_file    |
      | sample.04.xlsx | expected.04.json | config.02.json |
      | sample.05.xlsx | expected.05.json | config.02.json |
