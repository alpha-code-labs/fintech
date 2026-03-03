from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import macro, scanner, stock, portfolio, briefing

app = FastAPI(title="Investment Scanner API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(macro.router, prefix="/api")
app.include_router(scanner.router, prefix="/api")
app.include_router(stock.router, prefix="/api")
app.include_router(portfolio.router, prefix="/api")
app.include_router(briefing.router, prefix="/api")


@app.get("/")
def root():
    return {"status": "ok"}
