import argparse
from config import Config
import constants
import os
from data_validator import DataValidator
import logging


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
    console_handler.setLevel(logging.DEBUG)
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


def action(config: Config, logger: logging.Logger):
    try:
        app = DataValidator(config, logger)
        app.run()

        logger.info("File completed successfully.")
    except Exception as e:
        logger.error(f"An error occurred during file comparison: {e}")
        raise


def main():
    args = parse_arguments()
    logger = setup_logging(verbose=args.verbose)

    try:
        logger.info(f"Starting with config: {args.config}")
        config = Config(args.config)

        # Run the application
        action(config, logger)
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
