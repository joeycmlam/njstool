from py_rules.components import Condition, Result, Rule
from py_rules.engine import RuleEngine



class BusinessRulesEngine:
    def __init__(self):
        self.rules = []
        self._build_rules()
    
    def _build_rules(self):
        # Onshore Equity: HK country with Equity or ETF security type
        condition1 = Condition('country', '==', 'HK')
        condition2 = Condition('security_type', 'in', ['Equity', 'ETF'])
        result1 = Result('category', 'str', 'onshore_equity')
        rule1 = Rule('Onshore Equity Rule').If(condition1).Then(result1)
        self.rules.append(rule1)
        
        # Offshore Equity: Non-HK country with Equity or ETF security type
        condition3 = Condition('country', '!=', 'HK')
        condition4 = Condition('security_type', 'in', ['Equity', 'ETF'])
        result2 = Result('category', 'str', 'offshore_equity')
        rule2 = Rule('Offshore Equity Rule').If(condition3).Then(result2)
        self.rules.append(rule2)
        
        # Onshore Fixed Income: HK country with Bond security type
        condition5 = Condition('country', '==', 'HK')
        condition6 = Condition('security_type', '==', 'Bond')
        result3 = Result('category', 'str', 'onshore_fixed_income')
        rule3 = Rule('Onshore Fixed Income Rule').If(condition5).Then(result3)
        self.rules.append(rule3)
        
        # Offshore Fixed Income: Non-HK country with Bond security type
        condition7 = Condition('country', '!=', 'HK')
        condition8 = Condition('security_type', '==', 'Bond')
        result4 = Result('category', 'str', 'offshore_fixed_income')
        rule4 = Rule('Offshore Fixed Income Rule').If(condition7).Then(result4)
        self.rules.append(rule4)
        
        # Currency: Currency security type
        condition9 = Condition('security_type', '==', 'Currency')
        result5 = Result('category', 'str', 'currency')
        rule5 = Rule('Currency Rule').If(condition9).Then(result5)
        self.rules.append(rule5)
        
        # Commodity: Commodity security type
        condition10 = Condition('security_type', '==', 'Commodity')
        result6 = Result('category', 'str', 'commodity')
        rule6 = Rule('Commodity Rule').If(condition10).Then(result6)
        self.rules.append(rule6)

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