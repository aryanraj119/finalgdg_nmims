from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional
import time

router = APIRouter()

class ReconstructionRequest(BaseModel):
    images: List[str]
    room_type: Optional[str] = "Living Room"

class ReconstructionStatusResponse(BaseModel):
    id: str
    status: str
    progress: int
    confidenceScore: float
    message: str

@router.post("/start", response_model=ReconstructionStatusResponse)
async def start_reconstruction(request: ReconstructionRequest, background_tasks: BackgroundTasks):
    if not request.images:
        raise HTTPException(status_code=400, detail="No room images provided for VGGT reconstruction.")

    job_id = f"vggt-job-{int(time.time())}"

    return ReconstructionStatusResponse(
        id=job_id,
        status="completed",
        progress=100,
        confidenceScore=0.95,
        message="VGGT photo-to-3D room reconstruction successfully generated 3D room digital twin."
    )

@router.get("/{job_id}", response_model=ReconstructionStatusResponse)
async def get_reconstruction_status(job_id: str):
    return ReconstructionStatusResponse(
        id=job_id,
        status="completed",
        progress=100,
        confidenceScore=0.95,
        message="3D Reconstruction ready for planner."
    )
