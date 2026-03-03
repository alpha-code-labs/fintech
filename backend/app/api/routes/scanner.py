import json
from pathlib import Path
from fastapi import APIRouter

router = APIRouter()
DATA_DIR = Path(__file__).resolve().parents[3] / "data" / "dummy"


@router.get("/scanner")
def get_scanner():
    with open(DATA_DIR / "scanner.json") as f:
        return json.load(f)
