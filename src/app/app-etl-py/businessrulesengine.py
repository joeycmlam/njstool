from py_rules.components import Condition, Result, Rule
from py_rules.engine import RuleEngine

class BusinessRulesEngine:
    def __init__(self, rules=None):
        """
        Initialize BusinessRulesEngine with user-provided rules.
        If no rules are provided, self.rules will be an empty list.
        """
        self.rules = rules if rules is not None else []

    def evaluate(self, record):
        try:
            engine = RuleEngine(record)
            for rule in self.rules:
                result = engine.evaluate(rule)
                if result:
                    # Return the category value if present, else the result object
                    return getattr(result, 'value', result)
            return "others"
        except Exception as e:
            print(f"Error creating rule engine: {e}")
            return "others"