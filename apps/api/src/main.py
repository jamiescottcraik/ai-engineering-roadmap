from typing import Any

from fastapi import FastAPI
from routers import health_router, ollama_router, roadmap_router

app = FastAPI(
    title="brAInwav API",
    description="AI Engineering Roadmap Backend API",
    version="0.1.0",
)

# Include routers
app.include_router(health_router)
app.include_router(roadmap_router)
app.include_router(ollama_router)


@app.get("/")
async def root() -> dict[str, Any]:
    """Root endpoint with basic API information."""
    return {"message": "brAInwav API is running", "status": "healthy"}
