import csv
import json
import argparse
import sys
from businessrulesengine import BusinessRulesEngine

class CsvReader:
    def __init__(self, input_file):
        self.input_file = input_file

    def read_records(self):
        with open(self.input_file, newline="") as csvfile:
            reader = csv.DictReader(csvfile)
            return list(reader), reader.fieldnames

class RuleLoader:
    def __init__(self, rules_file):
        self.rules_file = rules_file

    def load_rules(self):
        with open(self.rules_file, 'r') as f:
            return json.load(f)

class CsvWriters:
    def __init__(self, categories, fieldnames):
        self.files = {}
        self.writers = {}
        for category in categories:
            filename = category["output_file"]
            key = category["name"]
            f = open(filename, "w", newline="")
            self.files[key] = f
            writer = csv.DictWriter(f, fieldnames=fieldnames or [])
            writer.writeheader()
            self.writers[key] = writer

    def write(self, category, record):
        self.writers[category].writerow(record)

    def close(self):
        for f in self.files.values():
            f.close()

def parse_arguments():
    parser = argparse.ArgumentParser(description='Split CSV file based on rules using business rules engine')
    parser.add_argument('--config', '-c', 
                       default='rules.json',
                       help='Configuration JSON file path (default: rules.json)')
    return parser.parse_args()

def main():
    args = parse_arguments()
    
    try:
        # Load configuration
        rule_loader = RuleLoader(args.config)
        rules = rule_loader.load_rules()
        
        # Get input file from config
        input_file = rules.get("input_file", "")
        if not input_file:
            print("Error: No input_file specified in config")
            sys.exit(1)
        
        # Initialize business rules engine
        rules_engine = BusinessRulesEngine()
        
        # Initialize CSV reader and writers
        reader = CsvReader(input_file)
        records, fieldnames = reader.read_records()
        writers = CsvWriters(rules["categories"], fieldnames)

        # Process records line by line
        processed_count = 0
        for record in records:
            # Get category from business rules engine
            category = rules_engine.evaluate(record)
            
            # Write record to appropriate output file
            writers.write(category, record)
            processed_count += 1
            
            # Print progress every 10 records
            if processed_count % 10 == 0:
                print(f"Processed {processed_count} records...")

        writers.close()

        print(f"CSV splitting completed using business rules engine!")
        print(f"Input file: {input_file}")
        print(f"Total records processed: {processed_count}")
        print("Files created based on rules configuration:")
        for category in rules["categories"]:
            print(f"  - {category['output_file']}")
            
    except FileNotFoundError as e:
        print(f"Error: File not found - {e}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in config file - {e}")
        sys.exit(1)
    except KeyError as e:
        print(f"Error: Missing required field in config - {e}")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()