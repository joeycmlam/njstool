import csv
from py_rules.components import Condition, Rule
from py_rules.engine import RuleEngine


class CsvSplitter:
    def __init__(self, input_file):
        self.input_file = input_file
        self.fieldnames = []
        self.writers = {}
        self.files = {}

    def read_records(self):
        with open(self.input_file, newline="") as csvfile:
            reader = csv.DictReader(csvfile)
            self.fieldnames = reader.fieldnames
            return list(reader)

    def setup_writers(self):
        file_configs = {
            "us_equity.csv": "us_equity",
            "hk_bond.csv": "hk_bond",
            "jp_commodity.csv": "jp_commodity",
            "others.csv": "others"
        }

        for filename, key in file_configs.items():
            f = open(filename, "w", newline="")
            self.files[key] = f
            writer = csv.DictWriter(f, fieldnames=self.fieldnames)
            writer.writeheader()
            self.writers[key] = writer

    def close_files(self):
        for f in self.files.values():
            f.close()

    def determine_category(self, record):
        """Determine which category a record belongs to"""
        engine = RuleEngine(record)

        # Create rules for each category
        us_equity_rule = Rule('US Equity').If(
            Condition('country', '==', 'US') &
            Condition('security_type', '==', 'Equity')
        )

        hk_bond_rule = Rule('HK Bond').If(
            Condition('country', '==', 'HK') &
            Condition('security_type', '==', 'Bond')
        )

        jp_commodity_rule = Rule('JP Commodity').If(
            Condition('country', '==', 'JP') &
            Condition('security_type', '==', 'Commodity')
        )

        # Check rules in order
        if engine.evaluate(us_equity_rule):
            return "us_equity"
        elif engine.evaluate(hk_bond_rule):
            return "hk_bond"
        elif engine.evaluate(jp_commodity_rule):
            return "jp_commodity"
        else:
            return "others"

    def split(self, records):
        for record in records:
            category = self.determine_category(record)
            self.writers[category].writerow(record)


def main():
    input_file = "etf_portfolio_sample.csv"
    splitter = CsvSplitter(input_file)
    records = splitter.read_records()
    splitter.setup_writers()
    splitter.split(records)
    splitter.close_files()

    print("CSV splitting completed!")
    print("Files created: us_equity.csv, hk_bond.csv, jp_commodity.csv, others.csv")


if __name__ == "__main__":
    main()
