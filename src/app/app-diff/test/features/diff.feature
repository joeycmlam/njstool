Feature: FileComparator

  Scenario Outline: Match
    Given I have two files "<file1>" and "<file2>"
    When I compare the files using FileComparator
    Then the total number of matching rows should be <matches>
    And the total number of mismatching rows should be <mismatches>

    Examples:
      | file1          | file2          | matches | mismatches |
      | identical1.txt | identical2.txt |     100 |          0 |

