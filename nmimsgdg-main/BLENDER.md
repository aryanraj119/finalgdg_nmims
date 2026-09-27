# Blender MCP & Asset Pipeline

## Developer Workflow

1. **Asset Creation & Optimization:**
   - 3D models created in Blender.
   - Scale normalized to 1 unit = 1 meter.
   - Pivot point placed at bottom center (Y=0).
   - Exported as compressed GLB files into `public/models/`.

2. **Blender MCP Tools:**
   The development environment supports Blender MCP for AI-assisted 3D modeling and room processing commands:
   - `create_room()`
   - `align_floor()`
   - `optimize_mesh()`
   - `export_glb()`
