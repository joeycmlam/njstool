"""
Simple Loguru Logger - Clean and focused logging with loguru
"""

import os
import sys
from datetime import datetime

def setup_logger():
    """Setup loguru logger with console and file output."""
    try:
        from loguru import logger
        
        # Remove default handler
        logger.remove()
        
        # Create log directory
        log_dir = 'log'
        if not os.path.exists(log_dir):
            os.makedirs(log_dir)
        
        # Console handler with colored output
        logger.add(
            sys.stdout,
            format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> [<level>{level}</level>] <level>{message}</level>",
            level="INFO",
            colorize=True
        )
        
        # File handler with detailed output
        logger.add(
            os.path.join(log_dir, f"app_{datetime.now().strftime('%Y%m%d')}.log"),
            format="{time:YYYY-MM-DD HH:mm:ss} [{level}] {name}:{function}:{line} - {message}",
            level="DEBUG",
            rotation="1 day",
            retention="30 days"
        )
        
        return logger
        
    except ImportError:
        print("Loguru not installed. Please run: pip install loguru")
        sys.exit(1)

# Setup and export logger
logger = setup_logger()

# Convenience functions
def debug(message):
    logger.debug(message)

def info(message):
    logger.info(message)

def warning(message):
    logger.warning(message)

def error(message):
    logger.error(message)

def success(message):
    logger.success(message) 