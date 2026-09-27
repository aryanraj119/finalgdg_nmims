# SPYLT Circular Hub — AI 3D Room Planner & Second-Hand Furniture Marketplace

Production MVP for an **AI-powered second-hand furniture marketplace with an interactive 3D Room Planner, photo-to-3D room reconstruction (VGGT), AI spatial furniture arrangement (Nemotron/Ollama), Blender asset pipeline, and future AR support**.

Designed with an original premium Scandinavian visual language (clean whites, charcoal typography, warm neutral surfaces, restrained yellow/blue accents).

---

## 🚀 Key Features

1. **Interactive 3D Room Planner (Three.js / React Three Fiber / Drei / Zustand)**
   - 3D Orbit, Zoom, Pan & 2D Topdown view modes.
   - Object Selection, Translation, Rotation Y, Duplication, and Deletion.
   - Real-time **Collision Detection** (AABB furniture vs. furniture & room boundary validation).
   - Real-time **Walking Clearance Analyzer** (warns if aisles are narrower than 0.9m).
   - Real-time **Furniture Subtotal Cost Calculator** in INR.
   - Floating Glassmorphic HUD Header with L/M size segmented pill, 1:1 Scale, Measurement Units (Meters, Centimeters, Feet, Inches), Undo/Redo, Depth Map grid overlay, and Photo Upload backdrop trigger.

2. **✨ AI Spatial Room Furnishing (Nemotron LLM / Ollama & Structured Action Validation)**
   - Natural language room layout commands (e.g. *"Furnish this classroom for 30 students under ₹40,000 with comfortable walking space"*).
   - Strict JSON Action Schema (`add`, `move`, `rotate`, `delete`, `duplicate`, `replace`) validated before applying.
   - Decoupled `RoomAI` architecture supporting both local Ollama/Nemotron LLM and `MockRoomAI` production fallback.

3. **📷 Scan My Room (VGGT Photo-to-3D Reconstruction)**
   - Upload multiple room photographs to construct a 1:1 scale 3D Digital Twin.
   - `RoomReconstructionProvider` abstraction supporting `VGGTReconstructionProvider` and `MockReconstructionProvider`.

4. **🛒 Second-Hand Furniture Marketplace**
   - 15+ pre-loved Scandinavian furniture products across 14 categories.
   - Price in INR, percentage savings, condition badges (*Like New*, *Excellent*, *Good*, *Fair*), seller info, location, and real-world dimensions.
   - Instant "+ Add to 3D Room" and "Add to Cart" actions.

5. **🏛 Room Templates & One-Click Demo Mode**
   - Built-in room presets: **Classroom** (30 student desks & chairs + teacher setup), **Office**, **Hospital**, **Gym**, and **Living Room**.
   - Custom room dimensions editor (Width, Length, Height).

---

## 🛠 Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Three.js, React Three Fiber, @react-three/drei, Zustand, Tailwind CSS, GSAP.
- **Backend:** FastAPI (Python), PyDantic, Uvicorn.
- **AI / Reconstruction:** Nemotron / Ollama LLM provider, VGGT (Visual Geometry Grounding Transformer) Pipeline, Blender MCP asset pipeline.

---

## 🚦 Getting Started

### 1. Frontend Setup & Launch

```bash
cd spyltmilk/client
npm install
npm run dev
```

Visit `http://localhost:8000/` or `http://localhost:8000/planner`.

### 2. Fast Build & Production Preview

```bash
npm run build
```

---

## 📄 License & Attribution
Designed for SPYLT Circular Economy & Second-Hand Furniture Platform.
