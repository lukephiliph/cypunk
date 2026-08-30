from pydantic import BaseModel


class PlayerJoinRequest(BaseModel):
    character_id: str


class PlayerJoinResponse(BaseModel):
    player_id: str
    character_id: str
    world: str