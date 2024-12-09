import argparse
from file_comparison import FileComparisonApp

def main():
    # Parse command-line arguments
    parser = argparse.ArgumentParser(description="File Comparison Tool")
    parser.add_argument(
        "--config",
        type=str,
        default="config.json",
        help="Path to the configuration file (default: config.json)"
    )
    args = parser.parse_args()

    # Pass the configuration file to the application
    app = FileComparisonApp(args.config)
    app.run()


if __name__ == "__main__":
    main()