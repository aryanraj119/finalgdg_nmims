# VGGT (Visual Geometry Grounding Transformer) Pipeline

## Photo-to-3D Reconstruction Architecture

```text
Photos (5-10 Viewpoints)
 ↓
Multiview Camera Pose Estimation
 ↓
Depth Map Fusion & Point Cloud Extraction
 ↓
3D Bounding Box Object Detection
 ↓
Blender Mesh Decimation & GLB Export
 ↓
React 3D Room Planner
```

The system uses `VGGTReconstructionProvider` to communicate with the FastAPI backend endpoint `/api/reconstruction/start`. If the GPU backend is offline, `MockReconstructionProvider` automatically generates a digital twin scene so the frontend planner never crashes.
