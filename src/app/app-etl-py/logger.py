import os
import sys
from abc import ABC, abstractmethod
from datetime import datetime

class ILogger(ABC):
    """Simple logging interface."""
    
    @abstractmethod
    def debug(self, message: str) -> None:
        pass
    
    @abstractmethod
    def info(self, message: str) -> None:
        pass
    
    @abstractmethod
    def warning(self, message: str) -> None:
        pass
    
    @abstractmethod
    def error(self, message: str) -> None:
        pass
    
    @abstractmethod
    def success(self, message: str) -> None:
        pass

class LoguruLogger(ILogger):
    """Simple loguru implementation."""
    
    def __init__(self, level: str = "INFO"):
        try:
            from loguru import logger
            self.logger = logger
            self.level = level
            self._setup_logger()
        except ImportError:
            raise ImportError("Loguru not installed. Please run: pip install loguru")
    
    def _setup_logger(self):
        """Setup basic loguru logger."""
        self.logger.remove()
        
        # Console output
        self.logger.add(
            sys.stdout,
            format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> [<level>{level}</level>] <level>{message}</level>",
            level=self.level,
            colorize=True
        )
        
        # File output
        log_dir = 'log'
        if not os.path.exists(log_dir):
            os.makedirs(log_dir)
        
        self.logger.add(
            os.path.join(log_dir, f"app_{datetime.now().strftime('%Y%m%d')}.log"),
            format="{time:YYYY-MM-DD HH:mm:ss} [{level}] {message}",
            level="DEBUG",
            rotation="1 day"
        )
    
    def debug(self, message: str) -> None:
        self.logger.debug(message)
    
    def info(self, message: str) -> None:
        self.logger.info(message)
    
    def warning(self, message: str) -> None:
        self.logger.warning(message)
    
    def error(self, message: str) -> None:
        self.logger.error(message)
    
    def success(self, message: str) -> None:
        self.logger.success(message)

# Simple factory function
def create_logger(level: str = "INFO") -> ILogger:
    return LoguruLogger(level) 