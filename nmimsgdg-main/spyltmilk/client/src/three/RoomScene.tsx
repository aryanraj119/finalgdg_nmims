import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRoomStore } from "../store/roomStore";
import { useUIStore } from "../store/uiStore";
import { Floor } from "./Floor";
import { Walls } from "./Walls";
import { Grid } from "./Grid";
import { FurnitureObject } from "./FurnitureObject";

export const RoomScene: React.FC = () => {
    const currentRoom = useRoomStore((state) => state.currentRoom);
    const selectedObjectId = useRoomStore((state) => state.selectedObjectId);
    const selectObject = useRoomStore((state) => state.selectObject);
    const collisions = useRoomStore((state) => state.collisions);

    const viewMode = useUIStore((state) => state.viewMode);
    const depthMapActive = useUIStore((state) => state.depthMapActive);

    const is2D = viewMode === "2D";

    return (
        <div className="relative w-full h-full min-h-[500px] bg-slate-950 overflow-hidden">
            <Canvas
                shadows
                camera={{
                    position: is2D ? [0, 12, 0.001] : [0, 8, 10],
                    fov: is2D ? 45 : 50
                }}
                onPointerDown={(e) => {
                    // Clicking canvas background deselects objects
                    if (e.target === e.currentTarget) {
                        selectObject(null);
                    }
                }}
            >
                {/* Lighting */}
                <ambientLight intensity={depthMapActive ? 0.2 : 0.8} />
                <directionalLight
                    position={[10, 15, 10]}
                    intensity={1.2}
                    castShadow
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                />
                <pointLight position={[-10, 10, -10]} intensity={0.5} />

                {/* Orbit Controls */}
                <OrbitControls
                    enableRotate={!is2D}
                    maxPolarAngle={is2D ? 0 : Math.PI / 2 - 0.05}
                    minDistance={2}
                    maxDistance={25}
                />

                {/* 3D Room Structure */}
                <group>
                    <Floor width={currentRoom.width} length={currentRoom.length} />
                    {!is2D && (
                        <Walls
                            width={currentRoom.width}
                            length={currentRoom.length}
                            height={currentRoom.height}
                            wallThickness={currentRoom.wallThickness || 0.15}
                        />
                    )}
                    <Grid width={currentRoom.width} length={currentRoom.length} />

                    {/* Scene Objects */}
                    {currentRoom.objects.map((obj) => (
                        <FurnitureObject
                            key={obj.id}
                            object={obj}
                            isSelected={selectedObjectId === obj.id}
                            isColliding={!!collisions.get(obj.id)}
                        />
                    ))}
                </group>
            </Canvas>
        </div>
    );
};
