from typing import Any

from fastapi import FastAPI

app = FastAPI(
    title="brAInwav API",
    description="AI Engineering Roadmap Backend API",
    version="0.1.0",
)


@app.get("/")
async def root() -> dict[str, Any]:
    """Health check endpoint."""
    return {"message": "brAInwav API is running", "status": "healthy"}


@app.get("/health")
async def health_check() -> dict[str, Any]:
    """Health check endpoint for monitoring."""
    return {"status": "healthy", "service": "brainwav-backend"}
