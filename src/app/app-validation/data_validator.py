import os
import csv
from typing import Dict, List, Any, Tuple
import pandas as pd  # For writing Excel output
from config import Config
from reference_validator import ReferenceValidator


class DataValidator:
    """
    Reads a delimited file, validates field lengths and reference data,
    and writes a result file with validation status.
    Optimized for performance with large datasets.
    """

    def __init__(self, config: Config, logger):
        """Initialize validator with configuration and logger."""
        self.config = config
        self.logger = logger
        
        # Extract configuration
        self.data_file = self.config.get("data_file", "")
        self.columns = self.config.get("columns", {})
        self.delimiter = self.config.get("delimiter", ",")
        self.output_config = self.config.get("output", {})
        
        # Validation results
        self.results = []
        
        # Create and initialize reference validator
        self.ref_validator = ReferenceValidator(logger)
        self._initialize_reference_validators()
        
    def _initialize_reference_validators(self):
        """Load all reference data from configuration."""
        for field_name, field_config in self.columns.items():
            if "reference" in field_config and isinstance(field_config["reference"], dict):
                ref_config = field_config["reference"]
                ref_file = ref_config.get("file", "")
                value_column = ref_config.get("valueColumn", "code")
                
                if ref_file:
                    self.logger.info(f"Loading reference data for {field_name} from {ref_file}")
                    self.ref_validator.load_reference_file(field_name, ref_file, value_column)
    
    def _validate_field_length(self, field: str, value: str) -> bool:
        """Validate field value length against configuration."""
        if field not in self.columns:
            return True
            
        field_config = self.columns[field]
        max_length = field_config.get("length")
        
        if not max_length:
            return True
            
        return len(str(value)) <= int(max_length)
    
    def _validate_field_reference(self, field: str, value: str) -> bool:
        """Validate field value against reference data."""
        if field not in self.columns:
            return True
            
        field_config = self.columns[field]
        if "reference" not in field_config:
            return True
            
        # Clean/prepare value if needed (trim, uppercase, etc.)
        cleaned_value = str(value).strip()
        
        # Delegate to reference validator
        return self.ref_validator.validate(field, cleaned_value)
    
    def _process_row(self, row_id: int, row_data: Dict[str, str]) -> List[Dict[str, Any]]:
        """
        Process a single row of data, validating all relevant fields.
        Returns list of validation results.
        """
        row_results = []
        
        for field, value in row_data.items():
            if field not in self.columns:
                continue
                
            field_config = self.columns[field]
            if field_config.get("skip", False):
                continue
                
            # Validate both length and reference if applicable
            length_valid = self._validate_field_length(field, value)
            ref_valid = True
            
            if "reference" in field_config:
                ref_valid = self._validate_field_reference(field, value)
                
            valid = length_valid and ref_valid
            
            # Determine reason for failure
            reason = None
            if not valid:
                if not length_valid:
                    reason = "INVALID LENGTH"
                elif not ref_valid:
                    reason = "INVALID FORMAT"
                    
                self.logger.warning(
                    f"Validation failed - Row: {row_id}, Field: {field}, "
                    f"Value: '{value}', Reason: {reason}"
                )
            
            # Add to results
            row_results.append({
                "row_id": row_id,
                "column": field,
                "value": value,
                "status": "PASS" if valid else reason or "FAIL"
            })
            
        return row_results
    
    def _write_results(self, results: List[Dict[str, Any]]):
        """Write validation results to file based on configuration."""
        if not self.output_config or not results:
            return
            
        output_path = self.output_config.get("path", "./result")
        output_file = self.output_config.get("file", "validation_results.csv")
        headers = self.output_config.get("headers", ["Row ID", "Column", "Value", "Status"])
        
        # Create output directory if needed
        os.makedirs(output_path, exist_ok=True)
        full_path = os.path.join(output_path, output_file)
        
        # Add timestamp to filename if configured
        if self.output_config.get("timestamped", False):
            import datetime
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            file_name, file_ext = os.path.splitext(output_file)
            output_file = f"{file_name}_{timestamp}{file_ext}"
            full_path = os.path.join(output_path, output_file)
        
        try:
            # Determine format and write accordingly
            if output_file.lower().endswith('.xlsx'):
                # Convert results to DataFrame
                df = pd.DataFrame(results)
                # Rename columns to match headers if needed
                column_mapping = {
                    'row_id': headers[0], 
                    'column': headers[1], 
                    'value': headers[2], 
                    'status': headers[3]
                }
                df = df.rename(columns=column_mapping)
                
                # Write to Excel
                sheet_name = self.output_config.get("sheet_name", "Results")
                df.to_excel(full_path, sheet_name=sheet_name, index=False)
            else:
                # Write CSV
                with open(full_path, 'w', newline='', encoding='utf-8') as f:
                    writer = csv.DictWriter(f, fieldnames=['row_id', 'column', 'value', 'status'])
                    writer.writeheader()
                    writer.writerows(results)
                    
            self.logger.info(f"Wrote {len(results)} validation results to {full_path}")
            
        except Exception as e:
            self.logger.error(f"Error writing results: {e}")
    
    def run(self):
        """Execute validation process on the configured data file."""
        self.logger.info(f"Starting data validation of {self.data_file}")
        all_results = []
        
        try:
            if not os.path.isfile(self.data_file):
                raise FileNotFoundError(f"Data file not found: {self.data_file}")
            
            # Read and process the file
            with open(self.data_file, 'r', encoding='utf-8') as f:
                # Determine if file has header
                has_header = self.config.get("header", True)
                
                reader = csv.DictReader(f, delimiter=self.delimiter) if has_header else None
                
                if has_header and not reader.fieldnames:
                    raise ValueError("Failed to parse header row")
                
                if has_header:
                    # Process with header
                    for row_idx, row in enumerate(reader, start=2):  # Start at 2 to account for header row
                        row_results = self._process_row(row_idx, row)
                        all_results.extend(row_results)
                else:
                    # Process without header - would need to use column indices instead
                    self.logger.warning("Processing without header is not fully implemented")
                    
            # Write results to file
            self._write_results(all_results)
            
            # Log summary
            total = len(all_results)
            failed = sum(1 for r in all_results if r['status'] != "PASS")
            self.logger.info(f"Validation complete: {total} checks, {failed} failed, {total - failed} passed")
            
        except Exception as e:
            self.logger.error(f"Error during validation: {e}")
            raise
            
        return all_results