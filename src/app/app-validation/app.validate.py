import argparse
import logging
from config import Config
import constants
from validator import DataValidator

def setup_logging(verbose: bool = False) -> logging.Logger:
    """
    Configure basic logging for the script.
    Sets up console logging with detailed formatting and appropriate log level.
    
    Args:
        verbose: If True, sets logging level to DEBUG, otherwise INFO.
    
    Returns:
        logging.Logger: Configured logger instance
    """
    logger = logging.getLogger(constants.DEFAULT_LOGGER_NAME)
    logger.setLevel(logging.DEBUG if verbose else logging.INFO)

    # Create console handler with formatting
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.DEBUG if verbose else logging.INFO)
    formatter = logging.Formatter(
        constants.DEFAULT_LOG_FORMAT,
        datefmt=constants.DEFAULT_DATE_FORMAT
    )
    console_handler.setFormatter(formatter)
    
    # Add handler to logger if it doesn't already have handlers
    if not logger.handlers:
        logger.addHandler(console_handler)
    
    return logger


def parse_arguments() -> argparse.Namespace:
    """
    Parse command-line arguments for the file comparison tool.

    Returns:
        argparse.Namespace: Parsed command line arguments.
    """
    parser = argparse.ArgumentParser(
        description="File Comparison Tool - Compare two files and generate detailed Excel report",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=constants.CLI_EXAMPLES
    )
    
    parser.add_argument(
        "--config",
        type=str,
        default=constants.DEFAULT_CONFIG_PATH,
        help="Path to the configuration file (default: %(default)s)"
    )
    
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Enable verbose output"
    )
    
    return parser.parse_args()


def run_app(config: Config, logger: logging.Logger):
    """
    Initialize and run the FileComparisonApp with the specified configuration file.

    :param config_path: Path to the configuration file.
    :param logger: Logger instance for logging.
    """
    try:
        logger.info(f"Starting file comparison with config: {config.config_path}")
        app = DataValidator(config, logger)
        app.action()
        logger.info("File comparison completed successfully.")
    except Exception as e:
        logger.error(f"An error occurred during file comparison: {e}")
        raise


def main():
    """
    Entry point for the file comparison tool.
    Handles argument parsing, validation, and running the application.
    
    Returns:
        int: Exit code (0 for success, 1 for error)
    """
    args = parse_arguments()
    logger = setup_logging(verbose=args.verbose)
    
    try:
        logger.info(f"Starting with config: {args.config}")
        config = Config(args.config)
        
        # Run the application
        run_app(config, logger)
        logger.info("Application completed successfully")
        return constants.EXIT_SUCCESS
        
    except FileNotFoundError as e:
        logger.error(f"Configuration error: {e}")
        return constants.EXIT_FAILURE
    except Exception as e:
        logger.error(f"Application error: {e}", exc_info=True)
        return constants.EXIT_FAILURE


if __name__ == "__main__":
    try:
        exit_code = main()
        exit(exit_code)
    except Exception as e:
        print(f"Application error: {e}")
        exit(1)