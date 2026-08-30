
from fastapi import FastAPI

app = FastAPI(
    title="Cyberdane API",
    version="0.1.0",
)


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
    }