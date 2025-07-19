import json
from py_rules.components import Condition, Result, Rule

class RuleLoader:
    """
    Responsible for loading business rules from JSON files.
    Follows Single Responsibility Principle - only handles rule loading.
    """
    
    @staticmethod
    def load_rules_from_json(json_file_path):
        """
        Load rules from a JSON file and convert them to Rule objects.
        
        Args:
            json_file_path (str): Path to the JSON file containing rules
            
        Returns:
            list: List of Rule objects
            
        Raises:
            FileNotFoundError: If the JSON file is not found
            json.JSONDecodeError: If the JSON format is invalid
            ValueError: If the rule structure is invalid
        """
        try:
            with open(json_file_path, 'r') as file:
                data = json.load(file)
            
            rules = []
            for rule_data in data.get('rules', []):
                rule = RuleLoader._create_rule_from_data(rule_data)
                if rule:
                    rules.append(rule)
            
            return rules
            
        except FileNotFoundError:
            raise FileNotFoundError(f"JSON file '{json_file_path}' not found.")
        except json.JSONDecodeError as e:
            raise json.JSONDecodeError(f"Invalid JSON format in '{json_file_path}': {e}", e.doc, e.pos)
        except Exception as e:
            raise ValueError(f"Error loading rules from JSON: {e}")
    
    @staticmethod
    def _create_rule_from_data(rule_data):
        """
        Create a Rule object from rule data dictionary.
        
        Args:
            rule_data (dict): Dictionary containing rule information
            
        Returns:
            Rule: Rule object or None if invalid
        """
        try:
            # Create conditions
            conditions = []
            for condition_data in rule_data.get('conditions', []):
                condition = Condition(
                    condition_data['field'],
                    condition_data['operator'],
                    condition_data['value']
                )
                conditions.append(condition)
            
            # Combine conditions with AND operator
            if len(conditions) == 1:
                combined_condition = conditions[0]
            elif len(conditions) > 1:
                combined_condition = conditions[0]
                for condition in conditions[1:]:
                    combined_condition = combined_condition & condition
            else:
                return None  # Skip rules with no conditions
            
            # Create result - handle simple string format
            result_data = rule_data.get('result', '')
            if isinstance(result_data, str):
                # Simple string result - create Result object with category field
                result = Result('category', 'str', result_data)
            else:
                print(f"Warning: Invalid result format in rule '{rule_data.get('name', 'Unknown')}'")
                return None
            
            # Create rule
            rule = Rule(rule_data['name']).If(combined_condition).Then(result)
            return rule
            
        except KeyError as e:
            print(f"Warning: Missing required field '{e}' in rule '{rule_data.get('name', 'Unknown')}'")
            return None
        except Exception as e:
            print(f"Warning: Error creating rule '{rule_data.get('name', 'Unknown')}': {e}")
            return None 