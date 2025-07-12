import csv
import json
from py_rules.components import Condition, Rule
from py_rules.engine import RuleEngine


class CsvSplitter:
    def __init__(self, input_file, rules_file="rules.json"):
        self.input_file = input_file
        self.rules_file = rules_file
        self.fieldnames = []
        self.writers = {}
        self.files = {}
        self.rules = self._load_rules()

    def read_records(self):
        with open(self.input_file, newline="") as csvfile:
            reader = csv.DictReader(csvfile)
            self.fieldnames = reader.fieldnames
            return list(reader)

    def _load_rules(self):
        """Load rules from JSON file."""
        try:
            with open(self.rules_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            raise FileNotFoundError(f"Rules file not found: {self.rules_file}")
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON format in rules file: {e}")

    def setup_writers(self):
        """Setup CSV writers based on rules configuration."""
        for category in self.rules["categories"]:
            filename = category["output_file"]
            key = category["name"]
            
            f = open(filename, "w", newline="")
            self.files[key] = f
            writer = csv.DictWriter(f, fieldnames=self.fieldnames or [])
            writer.writeheader()
            self.writers[key] = writer

    def close_files(self):
        for f in self.files.values():
            f.close()

    def determine_category(self, record):
        """Determine which category a record belongs to based on JSON rules."""
        engine = RuleEngine(record)  # Removed unused variable

        # Check each category in order
        for category in self.rules["categories"]:
            category_name = category["name"]
            conditions = category["conditions"]
            
            # Skip "others" category as it's the default fallback
            if category_name == "others":
                continue
                
            # Check if record matches all conditions for this category
            matches = True
            for field, expected_value in conditions.items():
                if record.get(field) != expected_value:
                    matches = False
                    break
            
            if matches:
                return category_name
        
        # If no specific category matches, return "others"
        return "others"

    def split(self, records):
        for record in records:
            category = self.determine_category(record)
            self.writers[category].writerow(record)


def main():
    input_file = "etf_portfolio_sample.csv"
    rules_file = "rules.json"
    
    splitter = CsvSplitter(input_file, rules_file)
    records = splitter.read_records()
    splitter.setup_writers()
    splitter.split(records)
    splitter.close_files()

    print("CSV splitting completed!")
    print("Files created based on rules configuration:")
    for category in splitter.rules["categories"]:
        print(f"  - {category['output_file']}")


if __name__ == "__main__":
    main()
