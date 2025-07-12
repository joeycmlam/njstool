import csv
import json

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

class CategoryDecider:
    def __init__(self, rules):
        self.rules = rules

    def decide(self, record):
        for category in self.rules["categories"]:
            name = category["name"]
            conditions = category["conditions"]
            if name == "others":
                continue
            if all(record.get(field) == value for field, value in conditions.items()):
                return name
        return "others"

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

def main():
    input_file = "etf_portfolio_sample.csv"
    rules_file = "rules.json"

    # Single responsibility classes
    reader = CsvReader(input_file)
    rule_loader = RuleLoader(rules_file)
    rules = rule_loader.load_rules()
    records, fieldnames = reader.read_records()
    decider = CategoryDecider(rules)
    writers = CsvWriters(rules["categories"], fieldnames)

    for record in records:
        category = decider.decide(record)
        writers.write(category, record)
    writers.close()

    print("CSV splitting completed!")
    print("Files created based on rules configuration:")
    for category in rules["categories"]:
        print(f"  - {category['output_file']}")

def main():
    input_file = "etf_portfolio_sample.csv"
    rules_file = "rules.json"

    # Single responsibility classes
    reader = CsvReader(input_file)
    rule_loader = RuleLoader(rules_file)
    rules = rule_loader.load_rules()
    records, fieldnames = reader.read_records()
    decider = CategoryDecider(rules)
    writers = CsvWriters(rules["categories"], fieldnames)

    for record in records:
        category = decider.decide(record)
        writers.write(category, record)
    writers.close()

    print("CSV splitting completed!")
    print("Files created based on rules configuration:")
    for category in rules["categories"]:
        print(f"  - {category['output_file']}")
        
if __name__ == "__main__":
    main()