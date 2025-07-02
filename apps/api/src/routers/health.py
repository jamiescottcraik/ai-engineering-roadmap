"""
Health check router for the brAInwav API.
"""

from typing import Any

from fastapi import APIRouter

router = APIRouter(prefix="/health", tags=["health"])


@router.get("")
async def health_check() -> dict[str, Any]:
    """Health check endpoint for monitoring."""
    return {"status": "healthy", "service": "brainwav-backend"}


@router.get("/detailed")
async def detailed_health_check() -> dict[str, Any]:
    """Detailed health check with system information."""
    return {
        "status": "healthy",
        "service": "brainwav-backend",
        "version": "0.1.0",
        "api": "ready",
    }
