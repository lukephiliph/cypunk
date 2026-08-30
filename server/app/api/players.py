from uuid import uuid4

from fastapi import APIRouter

from app.schemas.player import (
    PlayerJoinRequest,
    PlayerJoinResponse,
)

router = APIRouter(
    prefix="/players",
    tags=["players"],
)


@router.post("/join", response_model=PlayerJoinResponse)
def join_world(payload: PlayerJoinRequest):
    player_id = str(uuid4())

    return PlayerJoinResponse(
        player_id=player_id,
        character_id=payload.character_id,
        world="Cyberdane",
    )