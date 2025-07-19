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

if __name__ == "__main__":
    # Example: caller defines rules and passes to BusinessRulesEngine
    rules = []
    # Onshore Equity: HK country with Equity or ETF security type
    condition1 = Condition('country', '==', 'HK')
    condition2 = Condition('security_type', 'in', ['Equity', 'ETF'])
    combined_condition = condition1 & condition2
    result1 = Result('category', 'str', 'onshore_equity')
    rule1 = Rule('Onshore Equity Rule').If(combined_condition).Then(result1)
    rules.append(rule1)

    # Offshore Equity: Non-HK country with Equity or ETF security type
    condition3 = Condition('country', '!=', 'HK')
    condition4 = Condition('security_type', 'in', ['Equity', 'ETF'])
    combined_condition2 = condition3 & condition4
    result2 = Result('category', 'str', 'offshore_equity')
    rule2 = Rule('Offshore Equity Rule').If(combined_condition2).Then(result2)
    rules.append(rule2)

    # Onshore Fixed Income: HK country with Bond security type
    condition5 = Condition('country', '==', 'HK')
    condition6 = Condition('security_type', '==', 'Bond')
    combined_condition = condition5 & condition6
    result3 = Result('category', 'str', 'onshore_fixed_income')
    rule3 = Rule('Onshore Fixed Income Rule').If(combined_condition).Then(result3)
    rules.append(rule3)

    # Offshore Fixed Income: Non-HK country with Bond security type
    condition7 = Condition('country', '!=', 'HK')
    condition8 = Condition('security_type', '==', 'Bond')
    combined_condition = condition7 & condition8
    result4 = Result('category', 'str', 'offshore_fixed_income')
    rule4 = Rule('Offshore Fixed Income Rule').If(combined_condition).Then(result4)
    rules.append(rule4)

    # Currency: Currency security type
    condition9 = Condition('security_type', '==', 'Currency')
    result5 = Result('category', 'str', 'currency')
    rule5 = Rule('Currency Rule').If(condition9).Then(result5)
    rules.append(rule5)

    # Commodity: Commodity security type
    condition10 = Condition('security_type', '==', 'Commodity')
    result6 = Result('category', 'str', 'commodity')
    rule6 = Rule('Commodity Rule').If(condition10).Then(result6)
    rules.append(rule6)

    engine = BusinessRulesEngine(rules)

    # Test cases
    test_records = [
        {'country': 'HK', 'security_type': 'Equity', 'portfolio_code': 'P001'},
        {'country': 'US', 'security_type': 'Equity', 'portfolio_code': 'P002'},
        {'country': 'HK', 'security_type': 'Bond', 'portfolio_code': 'P003'},
        {'country': 'US', 'security_type': 'Bond', 'portfolio_code': 'P004'},
        {'country': 'JP', 'security_type': 'Currency', 'portfolio_code': 'P005'},
        {'country': 'DE', 'security_type': 'Commodity', 'portfolio_code': 'P006'},
        {'country': 'CN', 'security_type': 'REIT', 'portfolio_code': 'P007'}
    ]

    for record in test_records:
        category = engine.evaluate(record)
        print(f"Record: {record} -> Category: {category}")