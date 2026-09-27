# Architecture Specification

## Overview

The SPYLT Circular platform follows a clean, modular, unidirectional architecture separating 3D graphics, state management, AI reasoning, and reconstruction services.

```text
USER
 ↓
React Web App (Vite + TS)
 ↓
3D Room Planner Canvas (React Three Fiber + Drei)
 ↓
Zustand Stores (roomStore, furnitureStore, uiStore)
 ↓
Service Layer (furnitureService, roomService, aiService, reconstructionService)
 ↓
FastAPI Backend / Ollama LLM / VGGT Reconstruction Worker
```

## System Layers

### 1. State Management (`src/store/`)
- `roomStore.ts`: Manages `RoomState` (width, length, height), `SceneObject[]`, history stack for Undo/Redo, selection, and triggers AABB collision detection & walking clearance checks on mutation.
- `furnitureStore.ts`: Manages second-hand product catalog, categories, condition filters, search queries, and shopping cart.
- `uiStore.ts`: Manages view modes (3D Orbit, 2D Topdown), measurement units, size mode (L/M), depth map toggle, and action modal visibility.

### 2. 3D Graphics Layer (`src/three/`)
- `RoomScene.tsx`: R3F Canvas renderer with OrbitControls, directional lighting, and shadows.
- `FurnitureObject.tsx`: Interactive 3D furniture mesh with wireframe selection bounds, collision warning badges, and pointer drag handlers on XZ floor plane.
- `CollisionSystem.ts`: AABB overlap calculation and room boundary validation algorithms.

### 3. AI & Action Validation (`src/services/aiService.ts`)
- `LayoutAction` Schema: Enforces structured JSON operations (`add`, `move`, `rotate`, `delete`, `duplicate`, `replace`).
- `validateLayoutAction()`: Verifies product existence, room boundaries, and coordinate safety before applying AI generated layouts.
- `NemotronRoomAI`: Communicates with local Ollama LLM server (`http://localhost:11434`).
- `MockRoomAI`: Fallback spatial layout generator.

### 4. Photo-to-3D Reconstruction (`src/services/reconstructionService.ts`)
- `VGGTReconstructionProvider`: Sends multiview room photographs to FastAPI backend for VGGT depth & mesh processing.
