from behave import *

use_step_matcher("re")


@given("I have a business rules engine initialized")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    raise NotImplementedError(u'STEP: Given I have a business rules engine initialized')


@when('I evaluate a record with country "(?P<country>.+)" and security type "(?P<security_type>.+)"')
def step_impl(context, country, security_type):
    """
    :type context: behave.runner.Context
    :type country: str
    :type security_type: str
    """
    raise NotImplementedError(
        u'STEP: When I evaluate a record with country "<country>" and security type "<security_type>"')


@then('the record should be categorized as "(?P<expected_category>.+)"')
def step_impl(context, expected_category):
    """
    :type context: behave.runner.Context
    :type expected_category: str
    """
    raise NotImplementedError(u'STEP: Then the record should be categorized as "<expected_category>"')