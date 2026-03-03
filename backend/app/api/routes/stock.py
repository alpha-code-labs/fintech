import json
from pathlib import Path
from fastapi import APIRouter, HTTPException

router = APIRouter()
DATA_DIR = Path(__file__).resolve().parents[3] / "data" / "dummy" / "stocks"


@router.get("/stock/{symbol}")
def get_stock(symbol: str):
    file_path = DATA_DIR / f"{symbol.upper()}.json"
    if not file_path.exists():
        raise HTTPException(status_code=404, detail=f"Stock {symbol} not found")
    with open(file_path) as f:
        return json.load(f)
