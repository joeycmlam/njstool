"""Constants used throughout the application."""

# Logging
DEFAULT_LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - [%(funcName)s:%(lineno)d] - %(message)s"
DEFAULT_DATE_FORMAT = "%Y-%m-%d %H:%M:%S"
DEFAULT_LOGGER_NAME = "FileDiffTool"

# CLI
DEFAULT_CONFIG_PATH = "config.json"
PROGRAM_DESCRIPTION = "File Comparison Tool - Compare two files and generate detailed Excel report"
CLI_EXAMPLES = """
Examples:
    %(prog)s --config config.json
    %(prog)s --config /path/to/config.json
    %(prog)s --config ./config/my_config.json
"""

# Exit Codes
EXIT_SUCCESS = 0
EXIT_FAILURE = 1 