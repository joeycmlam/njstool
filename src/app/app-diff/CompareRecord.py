import pandas as pd

MISSING_IN_SECOND_FILE = "is missing record in 2nd file"
MISSING_IN_FIRST_FILE = "is missing record in 1st file"
NOT_MATCH = "{} is not match"

class CompareRecord:
    def __init__(self, record1: pd.DataFrame, record2: pd.DataFrame, key: str, threshold: float = 0.01):
        self.record1 = record1
        self.record2 = record2
        self.key = key
        self.threshold = threshold

    def compare(self):
        mismatches = []
        matches = 0

        conditions = {
            self.key_not_in_record2: self.missing_in_second_file,
            self.key_not_in_record1: self.missing_in_first_file,
            self.records_not_equal: self.compare_columns,
        }

        for condition, action in conditions.items():
            if condition():
                mismatches += action()
                break
        else:
            matches += 1

        return mismatches, matches

    def key_not_in_record2(self):
        return self.key not in self.record2.index

    def missing_in_second_file(self):
        return [[self.key, MISSING_IN_SECOND_FILE, None, None]]

    def key_not_in_record1(self):
        return self.key not in self.record1.index

    def missing_in_first_file(self):
        return [[self.key, MISSING_IN_FIRST_FILE, None, None]]

    def records_not_equal(self):
        return not self.record1.loc[self.key].equals(self.record2.loc[self.key])

    def compare_columns(self):
        mismatches = []
        for col in self.record1.columns:
            val1 = self.record1.loc[self.key, col]
            val2 = self.record2.loc[self.key, col]
            if self.values_differ(val1, val2):
                mismatches.append([self.key, NOT_MATCH.format(col), val1, val2])
        return mismatches

    def values_differ(self, val1, val2):
        if isinstance(val1, (int, float)) and isinstance(val2, (int, float)):
            return abs(val1 - val2) > self.threshold
        else:
            return val1 != val2