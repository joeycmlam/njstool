import pytest
from pytest_bdd import scenarios, given, when, then, parsers

# Load all scenarios from the feature file automatically
scenarios('features/business-rules-engine.feature')


@given("I have a business rules engine initialized")
def business_rules_engine_initialized(business_rules_engine):
    """
    Given step that uses the business_rules_engine fixture.
    The fixture is automatically available to this step.

    :param business_rules_engine: BusinessRulesEngine fixture
    """
    # The engine is already initialized via the fixture
    assert business_rules_engine is not None
    assert len(business_rules_engine.rules) > 0


@when(parsers.parse('I evaluate a record with country "{country}" and security type "{security_type}"'),
      target_fixture="evaluation_result")
def evaluate_record(business_rules_engine, country, security_type):
    """
    When step that evaluates a record and stores the result.
    Uses target_fixture to make the result available to subsequent steps.

    :param business_rules_engine: BusinessRulesEngine fixture
    :param country: Country parameter from feature file
    :param security_type: Security type parameter from feature file
    :return: Evaluation result
    """
    # Create test record
    test_record = {
        'country': country,
        'security_type': security_type,
        'portfolio_code': 'TEST001'  # Default test portfolio code
    }

    # Evaluate using business rules engine
    result = business_rules_engine.evaluate(test_record)
    return result


@then(parsers.parse('the record should be categorized as "{expected_category}"'))
def verify_categorization(evaluation_result, expected_category):
    """
    Then step that verifies the evaluation result.

    :param evaluation_result: Result from the when step (via target_fixture)
    :param expected_category: Expected category from feature file
    """
    assert evaluation_result == expected_category, \
        f"Expected category '{expected_category}' but got '{evaluation_result}'"
