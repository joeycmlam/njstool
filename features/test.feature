Feature: test

  Scenario: test
    When do the testing "hello world"
    Given test hello world
    Then show test "hello world"


  Scenario Outline: test multlple patterns
    Given input the data "<inputData>"
    When convert
    Then validate the output "<expectedData>"
    Examples:
      | inputData     | expectedData  |
      | jlam@test.com | jlam@test.com |
      | chan@test.com | chan@test.com |
