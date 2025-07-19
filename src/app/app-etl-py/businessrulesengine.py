import logger
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
                    # Debug: print the result object to understand its structure
                    logger.debug(f"Debug - Result type: {type(result)}, Result: {result}")
                    
                    # Extract the value from the result object
                    if hasattr(result, 'value'):
                        return result.value
                    else:
                        # If result is a string representation of a dict, parse it
                        result_str = str(result)
                        if result_str.startswith('{') and result_str.endswith('}'):
                            # It's a dict representation, try to extract the value
                            import ast
                            try:
                                result_dict = ast.literal_eval(result_str)
                                if 'value' in result_dict:
                                    return result_dict['value']
                                elif 'category' in result_dict:
                                    return result_dict['category']
                            except:
                                pass
                        return result_str
            return "others"
        except Exception as e:
            logger.error(f"Error creating rule engine: {e}")
            return "others"