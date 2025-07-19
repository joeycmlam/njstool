import json
import argparse
import sys
from businessrulesengine import BusinessRulesEngine
from rule_loader import RuleLoader
from logger import ILogger, LoggerFactory
from configloader import ConfigLoader
from csvhelper import CsvReader, CsvWriters


class ETLProcessor:
    """Simple ETL Processor with logger dependency."""
    
    def __init__(self, logger: ILogger):
        self.logger = logger
    
    def process(self, config: dict):
        """Process ETL with the given configuration."""
        try:
            # Load business rules
            rule_file = config.get("rule_file", "")
            rules = RuleLoader.load_rules_from_json(rule_file)
            
            # Get input file from config
            input_file = config.get("input_file", "")
            if not input_file:
                self.logger.error("No input_file specified in config")
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
                    self.logger.warning(f"Category is not a string: {category} (type: {type(category)})")
                    category = str(category) if category is not None else "others"
                
                # Check if category exists in writers
                if category not in writers.writers:
                    self.logger.warning(f"Category '{category}' not found in config, using 'others'")
                    category = "others"
                
                # Write record to appropriate output file
                writers.write(category, record)
                processed_count += 1
                
                # Print progress every 10 records
                if processed_count % 10 == 0:
                    self.logger.info(f"Processed {processed_count} records...")

            writers.close()

            self.logger.success("CSV splitting completed using business rules engine!")
            self.logger.info(f"Input file: {input_file}")
            self.logger.info(f"Rules file: {rule_file}")
            self.logger.info(f"Total records processed: {processed_count}")
            self.logger.info("Files created based on rules configuration:")
            for category in config["categories"]:
                self.logger.info(f"  - {category['output_file']}")
                
        except FileNotFoundError as e:
            self.logger.error(f"File not found - {e}")
            sys.exit(1)
        except json.JSONDecodeError as e:
            self.logger.error(f"Invalid JSON in config file - {e}")
            sys.exit(1)
        except KeyError as e:
            self.logger.error(f"Missing required field in config - {e}")
            sys.exit(1)
        except Exception as e:
            self.logger.error(f"Error: {e}")
            sys.exit(1)

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

    # Load configuration
    config_loader = ConfigLoader(args.config)
    config = config_loader.load_config()
        
    # Get log level from config
    log_config = config.get("logger", {})

    # Create logger
    logger = LoggerFactory.create_logger(log_config.get("level", "INFO"))

    try:
        etl_processor = ETLProcessor(logger)
        
        # Process ETL
        etl_processor.process(config)
        
    except Exception as e:
        logger.error(f"Failed to initialize application: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()