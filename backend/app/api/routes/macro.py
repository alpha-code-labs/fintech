import json
from pathlib import Path
from fastapi import APIRouter

router = APIRouter()
DATA_DIR = Path(__file__).resolve().parents[3] / "data" / "dummy"


@router.get("/macro")
def get_macro():
    with open(DATA_DIR / "macro.json") as f:
        return json.load(f)
