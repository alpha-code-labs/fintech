import json
from pathlib import Path
from fastapi import APIRouter

router = APIRouter()
DATA_DIR = Path(__file__).resolve().parents[3] / "data" / "dummy"


@router.get("/portfolio")
def get_portfolio():
    with open(DATA_DIR / "portfolio.json") as f:
        return json.load(f)
