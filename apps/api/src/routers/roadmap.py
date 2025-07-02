"""
Roadmap management router for the brAInwav API.
"""

from pathlib import Path
from typing import Any

from fastapi import APIRouter
from services.roadmap_sequence import RoadmapSequenceFixer

router = APIRouter(prefix="/roadmap", tags=["roadmap"])


@router.post("/fix-sequence")
async def fix_sequence() -> dict[str, Any]:
    """Fix roadmap week ordering and update current week."""
    fixer = RoadmapSequenceFixer(Path("config/roadmap-config-2025.json"))
    await fixer.fix_sequence()
    return {"status": "ok"}
