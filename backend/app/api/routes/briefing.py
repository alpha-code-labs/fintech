import json
from pathlib import Path
from fastapi import APIRouter

router = APIRouter()
DATA_DIR = Path(__file__).resolve().parents[3] / "data" / "dummy"


@router.get("/briefing")
def get_briefing():
    with open(DATA_DIR / "briefing.json") as f:
        return json.load(f)
