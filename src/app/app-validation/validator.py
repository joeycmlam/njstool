from typing import List, Dict, Any, Iterable
from dataclasses import dataclass
import os

# Assumptions about existing modules (adapt if actual interfaces differ):
# file_parser.py exposes: class FileParser: def parse(self, file_path: str, delimiter: str) -> List[Dict[str, str]]
# config.py exposes: class ConfigLoader: def load(self, config_path: str) -> Dict[str, Any]

from file_parser import FileParser          # adjust import name if different
from config import ConfigLoader             # adjust import name if different


@dataclass
class ValidationRule:
    column: str
    max_length: int  # you can rename to 'length' if exact match required
    mode: str = "max"  # "max" = value length <= max_length; "equal" = ==


@dataclass
class ValidationResult:
    row_id: int
    column: str
    value: str
    passed: bool

    def to_row(self, pass_label: str, fail_label: str):
        return {
            "row_id": self.row_id,
            "column": self.column,
            "value": self.value,
            "result": pass_label if self.passed else fail_label
        }


class DataValidator:
    """
    Reads a delimited file, validates field lengths based on JSON config,
    and writes a result file with: row id | column name | value | pass/fail.
    """

    def __init__(self, config_path: str):
        self._config_loader = ConfigLoader()
        self.config = self._config_loader.load(config_path)
        self._parser = FileParser()

        # Expected config structure example:
        # {
        #   "input": { "file": "sample.csv", "delimiter": "|" },
        #   "output": { "file": "validation_result.csv", "delimiter": ",", "pass_label": "PASS", "fail_label": "FAIL" },
        #   "rules": {
        #       "columns": {
        #           "account_id": { "length": 12, "mode": "max" },
        #           "country": { "length": 2, "mode": "equal" }
        #       }
        #   }
        # }
        self.rules = self._build_rules()

        output_cfg = self.config.get("output", {})
        self.pass_label = output_cfg.get("pass_label", "PASS")
        self.fail_label = output_cfg.get("fail_label", "FAIL")

    def _build_rules(self) -> List[ValidationRule]:
        rules_section = self.config.get("rules", {}).get("columns", {})
        rules: List[ValidationRule] = []
        for col, spec in rules_section.items():
            length = spec.get("length")
            if length is None:
                continue
            mode = spec.get("mode", "max")
            rules.append(ValidationRule(column=col, max_length=int(length), mode=mode))
        return rules

    def validate_file(self, input_file: str = None) -> List[ValidationResult]:
        input_cfg = self.config.get("input", {})
        file_path = input_file or input_cfg.get("file")
        if not file_path:
            raise ValueError("Input file not specified (config.input.file missing).")
        delimiter = input_cfg.get("delimiter", "|")

        records = self._parser.parse(file_path, delimiter)
        results: List[ValidationResult] = []

        # Row id starts at 1 for the first data record
        for idx, record in enumerate(records, start=1):
            results.extend(self._validate_record(idx, record))

        return results

    def _validate_record(self, row_id: int, record: Dict[str, Any]) -> Iterable[ValidationResult]:
        for rule in self.rules:
            raw_value = record.get(rule.column, "")
            value_str = "" if raw_value is None else str(raw_value)
            length = len(value_str)
            if rule.mode == "equal":
                passed = length == rule.max_length
            else:  # default 'max'
                passed = length <= rule.max_length
            yield ValidationResult(row_id=row_id, column=rule.column, value=value_str, passed=passed)

    def write_results(self, results: List[ValidationResult], output_file: str = None):
        output_cfg = self.config.get("output", {})
        out_file = output_file or output_cfg.get("file") or "validation_result.csv"
        out_delim = output_cfg.get("delimiter", ",")

        # Ensure directory exists
        os.makedirs(os.path.dirname(out_file) or ".", exist_ok=True)

        # Collect headers
        headers = ["row_id", "column", "value", "result"]

        # Simple write (no external CSV util to keep independence)
        with open(out_file, "w", encoding="utf-8") as f:
            f.write(out_delim.join(headers) + "\n")
            for r in results:
                row = r.to_row(self.pass_label, self.fail_label)
                f.write(out_delim.join(str(row[h]) for h in headers) + "\n")

    def run(self):
        results = self.validate_file()
        self.write_results(results)
        return results