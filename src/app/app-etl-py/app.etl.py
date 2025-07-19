import csv
import json
import argparse
import sys
from businessrulesengine import BusinessRulesEngine
from rule_loader import RuleLoader
import logger

class CsvReader:
    def __init__(self, input_file):
        self.input_file = input_file

    def read_records(self):
        with open(self.input_file, newline="") as csvfile:
            reader = csv.DictReader(csvfile)
            return list(reader), reader.fieldnames

class ConfigLoader:
    def __init__(self, config_file):
        self.config_file = config_file

    def load_config(self):
        with open(self.config_file, 'r') as f:
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
                       default='config.json',
                       help='Configuration JSON file path (default: config.json)')
    parser.add_argument('--rules', '-r',
                       default='rules.json',
                       help='Rules JSON file path (default: rules.json)')
    return parser.parse_args()

def main():
    args = parse_arguments()
    logger.set_console_level("DEBUG")

    try:
        # Load configuration
        config_loader = ConfigLoader(args.config)
        config = config_loader.load_config()
        
        # Load business rules
        rule_file = config.get("rule_file", "")
        rules = RuleLoader.load_rules_from_json(rule_file)
        
        # Get input file from config
        input_file = config.get("input_file", "")
        if not input_file:
            logger.info("Error: No input_file specified in config")
            sys.exit(1)
        
        # Initialize business rules engine with loaded rules
        rules_engine = BusinessRulesEngine(rules)
        
        # Initialize CSV reader and writers
        reader = CsvReader(input_file)
        records, fieldnames = reader.read_records()
        writers = CsvWriters(config["categories"], fieldnames)

        # Process records line by line
        processed_count = 0
        for record in records:
            # Get category from business rules engine
            category = rules_engine.evaluate(record)
            
            # Ensure category is a string and handle potential issues
            if not isinstance(category, str):
                logger.warning(f"Warning: Category is not a string: {category} (type: {type(category)})")
                category = str(category) if category is not None else "others"
            
            # Check if category exists in writers
            if category not in writers.writers:
                logger.warning(f"Warning: Category '{category}' not found in config, using 'others'")
                category = "others"
            
            # Write record to appropriate output file
            writers.write(category, record)
            processed_count += 1
            
            # Print progress every 10 records
            if processed_count % 10 == 0:
                logger.info(f"Processed {processed_count} records...")

        writers.close()

        logger.info("CSV splitting completed using business rules engine!")
        logger.info(f"Input file: {input_file}")
        logger.info(f"Rules file: {args.rules}")
        logger.info(f"Total records processed: {processed_count}")
        logger.info("Files created based on rules configuration:")
        for category in config["categories"]:
            logger.info(f"  - {category['output_file']}")
            
    except FileNotFoundError as e:
        logger.error(f"Error: File not found - {e}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        logger.error(f"Error: Invalid JSON in config file - {e}")
        sys.exit(1)
    except KeyError as e:
        logger.error(f"Error: Missing required field in config - {e}")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Error: {e}{e.__traceback__}")
        sys.exit(1)

if __name__ == "__main__":
    main()