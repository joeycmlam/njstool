import pytest
import sys
import os

# Add the parent directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from businessrulesengine import BusinessRulesEngine


@pytest.fixture
def business_rules_engine():
    """Pytest fixture to create a BusinessRulesEngine instance."""
    return BusinessRulesEngine()
