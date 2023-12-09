Feature: PDF Comparator
  As a user
  I want to compare PDF files
  So that I can find differences

  Scenario Outline: Compare two PDF files
    Given I have a PDF file at "<file1>"
    And I have a PDF file at "<file2>"
    When I compare the two files
    Then the result should be "<expectedResult>"

    Examples: 
      | file1             | file2             | expectedResult |
      | path/to/file1.pdf | path/to/file2.pdf | identical      |
      | path/to/file3.pdf | path/to/file4.pdf | different      |
