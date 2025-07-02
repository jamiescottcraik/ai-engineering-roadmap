"""
Router module initialization for the brAInwav API.
"""

from .health import router as health_router
from .ollama import router as ollama_router
from .roadmap import router as roadmap_router

__all__ = ["health_router", "ollama_router", "roadmap_router"]
