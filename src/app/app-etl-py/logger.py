import os
import sys
from datetime import datetime

# Global logger instance
_logger = None

def setup_logger():
    """Setup loguru logger with console and file output."""
    global _logger
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
        
        _logger = logger
        return logger
        
    except ImportError:
        print("Loguru not installed. Please run: pip install loguru")
        sys.exit(1)

def get_logger():
    """Get the global logger instance."""
    global _logger
    if _logger is None:
        setup_logger()
    return _logger

def set_console_level(level):
    """Change the console log level."""
    global _logger
    if _logger is None:
        setup_logger()
    
    # Remove existing console handler and add new one
    _logger.remove()
    
    # Re-add file handler
    log_dir = 'log'
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)
    
    _logger.add(
        os.path.join(log_dir, f"app_{datetime.now().strftime('%Y%m%d')}.log"),
        format="{time:YYYY-MM-DD HH:mm:ss} [{level}] {name}:{function}:{line} - {message}",
        level="DEBUG",
        rotation="1 day",
        retention="30 days"
    )
    
    # Add new console handler with updated level
    _logger.add(
        sys.stdout,
        format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> [<level>{level}</level>] <level>{message}</level>",
        level=level,
        colorize=True
    )

def set_file_level(level):
    """Change the file log level."""
    global _logger
    if _logger is None:
        setup_logger()
    
    # Remove existing handlers and re-add with new file level
    _logger.remove()
    
    # Re-add console handler
    _logger.add(
        sys.stdout,
        format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> [<level>{level}</level>] <level>{message}</level>",
        level="INFO",
        colorize=True
    )
    
    # Add new file handler with updated level
    log_dir = 'log'
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)
    
    _logger.add(
        os.path.join(log_dir, f"app_{datetime.now().strftime('%Y%m%d')}.log"),
        format="{time:YYYY-MM-DD HH:mm:ss} [{level}] {name}:{function}:{line} - {message}",
        level=level,
        rotation="1 day",
        retention="30 days"
    )

def set_levels(console_level=None, file_level=None):
    """Change both console and file log levels."""
    if console_level is not None:
        set_console_level(console_level)
    if file_level is not None:
        set_file_level(file_level)

# Setup logger on import
setup_logger()

# Convenience functions
def debug(message):
    get_logger().debug(message)

def info(message):
    get_logger().info(message)

def warning(message):
    get_logger().warning(message)

def error(message):
    get_logger().error(message)

def success(message):
    get_logger().success(message) 