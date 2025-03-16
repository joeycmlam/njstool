"""Custom exceptions for the file comparison tool."""

class FileComparisonError(Exception):
    """Base exception for all file comparison errors."""
    pass


class ConfigurationError(FileComparisonError):
    """Raised when there is an error with the configuration."""
    pass


class ValidationError(FileComparisonError):
    """Raised when validation fails."""
    pass


class ComparisonError(FileComparisonError):
    """Raised when the file comparison fails."""
    pass 