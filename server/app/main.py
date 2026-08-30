from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.players import router as players_router

app = FastAPI(
    title="Cyberdane API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(players_router)


@app.get("/")
def root():
    return {
        "name": "Cyberdane API",
        "status": "online",
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "world": "Cyberdane",
    }