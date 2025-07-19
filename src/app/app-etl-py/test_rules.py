#!/usr/bin/env python3
"""
Test script to demonstrate the new architecture with RuleLoader and BusinessRulesEngine.
This follows the Single Responsibility Principle where:
- RuleLoader is responsible for loading rules from JSON
- BusinessRulesEngine is responsible for evaluating rules
- Main application coordinates between them
"""

from businessrulesengine import BusinessRulesEngine
from rule_loader import RuleLoader

def main():
    """Main function to test the rule loading and evaluation."""
    
    try:
        # Load rules from JSON file using RuleLoader
        print("Loading rules from rules.json...")
        rules = RuleLoader.load_rules_from_json('rules.json')
        print(f"Successfully loaded {len(rules)} rules")
        
        # Initialize BusinessRulesEngine with loaded rules
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

        print("\nTesting rule evaluation:")
        print("-" * 50)
        
        for record in test_records:
            category = engine.evaluate(record)
            print(f"Record: {record} -> Category: {category}")


            
    except FileNotFoundError as e:
        print(f"Error: {e}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main() 