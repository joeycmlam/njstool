import argparse
import os
import logging
from file_comparison import FileComparisonApp


def setup_logging():
    """
    Configure basic logging for the script.
    Logs will be displayed in the console.
    """
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(message)s"
    )


def parse_arguments() -> argparse.Namespace:
    """
    Parse command-line arguments for the file comparison tool.

    :return: Parsed arguments as a Namespace object.
    """
    parser = argparse.ArgumentParser(description="File Comparison Tool")
    parser.add_argument(
        "--config",
        type=str,
        default="config.json",
        help="Path to the configuration file (default: config.json)"
    )
    return parser.parse_args()


def validate_config_file(config_path: str):
    """
    Validate the existence of the configuration file.

    :param config_path: Path to the configuration file.
    :raises FileNotFoundError: If the configuration file does not exist.
    """
    if not os.path.exists(config_path):
        raise FileNotFoundError(f"Configuration file not found: {config_path}")


def run_app(config_path: str):
    """
    Initialize and run the FileComparisonApp with the specified configuration file.

    :param config_path: Path to the configuration file.
    """
    try:
        logging.info(f"Starting file comparison with config: {config_path}")
        app = FileComparisonApp(config_path)
        app.run()
        logging.info("File comparison completed successfully.")
    except Exception as e:
        logging.error(f"An error occurred during file comparison: {e}")
        raise


def main():
    """
    Entry point for the file comparison tool.
    Handles argument parsing, validation, and running the application.
    """
    setup_logging()
    args = parse_arguments()

    # Validate the configuration file
    try:
        validate_config_file(args.config)
    except FileNotFoundError as e:
        logging.error(e)
        return

    # Run the application
    run_app(args.config)


if __name__ == "__main__":
    main()