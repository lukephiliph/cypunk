
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()

connections: dict[str, WebSocket] = {}


@router.websocket("/ws/world/{player_id}")
async def world_socket(
    websocket: WebSocket,
    player_id: str,
):
    await websocket.accept()

    connections[player_id] = websocket

    await broadcast(
        {
            "type": "player_join",
            "player_id": player_id,
        },
        exclude=player_id,
    )

    try:
        while True:
            data = await websocket.receive_json()

            message = {
                **data,
                "player_id": player_id,
            }

            await broadcast(
                message,
                exclude=player_id,
            )

    except WebSocketDisconnect:
        connections.pop(player_id, None)

        await broadcast(
            {
                "type": "player_leave",
                "player_id": player_id,
            }
        )


async def broadcast(
    message: dict,
    exclude: str | None = None,
):
    disconnected: list[str] = []

    for player_id, socket in connections.items():
        if player_id == exclude:
            continue

        try:
            await socket.send_json(message)
        except Exception:
            disconnected.append(player_id)

    for player_id in disconnected:
        connections.pop(player_id, None)