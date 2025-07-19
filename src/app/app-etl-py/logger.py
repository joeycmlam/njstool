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
            self.level = level.upper()
            self._setup_logger()
        except ImportError:
            raise ImportError("Loguru not installed. Please run: pip install loguru")
    
    def _setup_logger(self):
        """Setup basic loguru logger."""
        self.logger.remove()
        
        # Console output with caller file and line info
        self.logger.add(
            sys.stdout,
            format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> [<level>{level}</level>] <cyan>{extra[caller_file]}:{extra[caller_line]}</cyan> - <level>{message}</level>",
            level=self.level,
            colorize=True
        )
        
        # File output with detailed caller file and line info
        log_dir = 'log'
        if not os.path.exists(log_dir):
            os.makedirs(log_dir)
        
        self.logger.add(
            os.path.join(log_dir, f"app_{datetime.now().strftime('%Y%m%d')}.log"),
            format="{time:YYYY-MM-DD HH:mm:ss} [{level}] {extra[caller_file]}:{extra[caller_line]} - {message}",
            level="DEBUG",
            rotation="1 day"
        )
    
    def _get_caller_info(self):
        """Get caller file and line information."""
        import inspect
        frame = inspect.currentframe()
        try:
            # Go up 2 frames: 1 for this method, 1 for the logging method
            if frame and frame.f_back and frame.f_back.f_back:
                caller_frame = frame.f_back.f_back
                filename = os.path.basename(caller_frame.f_code.co_filename)
                line_number = caller_frame.f_lineno
                return {"caller_file": filename, "caller_line": line_number}
        except (AttributeError, TypeError):
            pass
        # Fallback if we can't get caller info
        return {"caller_file": "unknown", "caller_line": 0}
    
    def debug(self, message: str) -> None:
        self.logger.bind(**self._get_caller_info()).debug(message)
    
    def info(self, message: str) -> None:
        self.logger.bind(**self._get_caller_info()).info(message)
    
    def warning(self, message: str) -> None:
        self.logger.bind(**self._get_caller_info()).warning(message)
    
    def error(self, message: str) -> None:
        self.logger.bind(**self._get_caller_info()).error(message)
    
    def success(self, message: str) -> None:
        self.logger.bind(**self._get_caller_info()).success(message)

# Simple factory function
def create_logger(level: str = "INFO") -> ILogger:
    return LoguruLogger(level) 