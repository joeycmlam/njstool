"""Command line interface for the file comparison tool."""

import argparse
from dataclasses import dataclass

from .constants import (
    DEFAULT_CONFIG_PATH,
    PROGRAM_DESCRIPTION,
    CLI_EXAMPLES
)


@dataclass
class CommandLineArgs:
    """Command line arguments container."""
    config_path: str
    verbose: bool


class ArgumentParser:
    """Handles command line argument parsing."""
    
    def __init__(self):
        """Initialize the argument parser with default configuration."""
        self.parser = self._create_parser()
    
    def parse_args(self) -> CommandLineArgs:
        """
        Parse command line arguments.
        
        Returns:
            CommandLineArgs containing parsed arguments
        """
        args = self.parser.parse_args()
        return CommandLineArgs(
            config_path=args.config,
            verbose=args.verbose
        )
    
    def _create_parser(self) -> argparse.ArgumentParser:
        """Create and configure the argument parser."""
        parser = argparse.ArgumentParser(
            description=PROGRAM_DESCRIPTION,
            formatter_class=argparse.RawDescriptionHelpFormatter,
            epilog=CLI_EXAMPLES
        )
        
        self._add_arguments(parser)
        return parser
    
    def _add_arguments(self, parser: argparse.ArgumentParser) -> None:
        """Add arguments to the parser."""
        parser.add_argument(
            "--config",
            type=str,
            default=DEFAULT_CONFIG_PATH,
            help=f"Path to the configuration file (default: {DEFAULT_CONFIG_PATH})"
        )
        
        parser.add_argument(
            "--verbose", "-v",
            action="store_true",
            help="Enable verbose output"
        ) 