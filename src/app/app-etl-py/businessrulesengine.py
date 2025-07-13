from py_rules.components import Condition, Result, Rule
from py_rules.engine import RuleEngine

class BusinessRulesEngine:
    def __init__(self):
        self.rules = []
        self._build_rules()
    
    def _build_rules(self):
        condition1 = Condition('country', '==', 'HK')
        result1 = Result('category', 'str', 'onshore_equity')
        rule1 = Rule('Onshore Equity Rule 1').If(condition1).Then(result1)
        self.rules.append(rule1)

        condition2 = Condition('country', '==', 'US')
        result2 = Result('category', 'str', 'offshore_equity')
        rule2 = Rule('Offshore Equity Rule 2').If(condition2).Then(result2)
        self.rules.append(rule2)


    def evaluate(self, record):
        try:
            engine = RuleEngine(record)
            for rule in self.rules:
                result = engine.evaluate(rule)
                if result:
                    return result
            return "others"
        except Exception as e:
            print(f"Error creating rule engine: {e}")
            return "others"
        
    
if __name__ == "__main__":
    engine = BusinessRulesEngine()
    record = {'country': 'HK', 'security_type': 'Equity', 'portfolio_code': 'P001'}
    print(engine.evaluate(record))
    record = {'country': 'US', 'security_type': 'Equity', 'portfolio_code': 'P002'}
    print(engine.evaluate(record))