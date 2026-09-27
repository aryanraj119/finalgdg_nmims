from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any

router = APIRouter()

class RoomSaveRequest(BaseModel):
    id: str
    name: str
    width: float
    length: float
    height: float
    objects: List[Dict[str, Any]]

@router.get("/")
async def list_rooms():
    return {"rooms": []}

@router.post("/")
async def save_room(room: RoomSaveRequest):
    return {"status": "saved", "room": room.dict()}
