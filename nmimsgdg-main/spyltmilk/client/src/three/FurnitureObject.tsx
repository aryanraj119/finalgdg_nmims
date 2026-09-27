import React, { useRef, useState, useEffect, useMemo } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { SceneObject } from "../types/room";
import { useRoomStore } from "../store/roomStore";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

interface FurnitureObjectProps {
    object: SceneObject;
    isSelected: boolean;
    isColliding: boolean;
}

const CustomObjModel: React.FC<{
    url: string;
    width: number;
    height: number;
    depth: number;
    color: string;
    isColliding: boolean;
    isSelected: boolean;
}> = ({ url, width, height, depth, color, isColliding, isSelected }) => {
    const [rawObj, setRawObj] = useState<THREE.Group | null>(null);
    const [loadFailed, setLoadFailed] = useState(false);

    useEffect(() => {
        if (!url) return;
        let active = true;

        const loader = new OBJLoader();
        loader.load(
            url,
            (loaded) => {
                if (active) {
                    setRawObj(loaded);
                    setLoadFailed(false);
                }
            },
            undefined,
            (err) => {
                console.warn(`[3D OBJ Loader] Failed to load "${url}":`, err);
                if (active) {
                    setLoadFailed(true);
                }
            }
        );

        return () => {
            active = false;
        };
    }, [url]);

    const processedMesh = useMemo(() => {
        if (!rawObj) return null;
        const c = rawObj.clone(true);
        const box = new THREE.Box3().setFromObject(c);
        const size = new THREE.Vector3();
        box.getSize(size);
        const center = new THREE.Vector3();
        box.getCenter(center);

        // Center geometry
        c.position.x -= center.x;
        c.position.y -= box.min.y; // Align bottom to floor
        c.position.z -= center.z;

        // Auto scale to match object width/height/depth bounds if size is non-zero
        if (size.x > 0 && size.y > 0 && size.z > 0) {
            const scaleX = width / size.x;
            const scaleY = height / size.y;
            const scaleZ = depth / size.z;
            c.scale.set(scaleX, scaleY, scaleZ);
        }

        c.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                mesh.material = new THREE.MeshStandardMaterial({
                    color: isColliding ? "#EF4444" : isSelected ? "#0058A3" : color,
                    roughness: 0.4,
                    metalness: 0.15
                });
            }
        });

        return c;
    }, [rawObj, width, height, depth, color, isColliding, isSelected]);

    if (loadFailed || !processedMesh) {
        return (
            <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
                <boxGeometry args={[width, height, depth]} />
                <meshStandardMaterial
                    color={isColliding ? "#EF4444" : isSelected ? "#0058A3" : color}
                    roughness={0.4}
                    metalness={0.1}
                />
            </mesh>
        );
    }

    return <primitive object={processedMesh} />;
};

export const FurnitureObject: React.FC<FurnitureObjectProps> = ({ object, isSelected, isColliding }) => {
    const groupRef = useRef<THREE.Group>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const selectObject = useRoomStore((state) => state.selectObject);
    const moveObject = useRoomStore((state) => state.moveObject);

    const width = object.width || 0.6;
    const depth = object.depth || 0.6;
    const height = object.height || 0.8;
    const color = object.color || "#64748B";

    const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        selectObject(object.id);
        setIsDragging(true);
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    };

    const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
        setIsDragging(false);
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    };

    const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
        if (!isDragging) return;
        e.stopPropagation();
        if (e.point) {
            // Drag on XZ floor plane
            moveObject(object.id, [e.point.x, 0, e.point.z]);
        }
    };

    return (
        <group
            ref={groupRef}
            position={object.position}
            rotation={object.rotation}
            scale={object.scale || [1, 1, 1]}
            onPointerOver={() => setIsHovered(true)}
            onPointerOut={() => setIsHovered(false)}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
        >
            {/* 3D Geometry Rendering (OBJ file or fallback box geometry) */}
            {object.modelUrl ? (
                <CustomObjModel
                    url={object.modelUrl}
                    width={width}
                    height={height}
                    depth={depth}
                    color={color}
                    isColliding={isColliding}
                    isSelected={isSelected}
                />
            ) : (
                <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
                    <boxGeometry args={[width, height, depth]} />
                    <meshStandardMaterial
                        color={isColliding ? "#EF4444" : isSelected ? "#0058A3" : color}
                        roughness={0.4}
                        metalness={0.1}
                    />
                </mesh>
            )}

            {/* Selection Bounding Wireframe Box */}
            {(isSelected || isHovered || isColliding) && (
                <mesh position={[0, height / 2, 0]}>
                    <boxGeometry args={[width + 0.05, height + 0.05, depth + 0.05]} />
                    <meshBasicMaterial
                        color={isColliding ? "#EF4444" : isSelected ? "#FFDB00" : "#38BDF8"}
                        wireframe
                    />
                </mesh>
            )}

            {/* Collision Warning Overlay */}
            {isColliding && (
                <Html position={[0, height + 0.3, 0]} center>
                    <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center space-x-1 whitespace-nowrap animate-pulse border border-red-300">
                        <span>⚠ Collision</span>
                    </div>
                </Html>
            )}

            {/* Selected Floating Tag */}
            {isSelected && !isColliding && (
                <Html position={[0, height + 0.3, 0]} center>
                    <div className="bg-[#0058A3] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center space-x-1 whitespace-nowrap border border-blue-300">
                        <span>{object.name}</span>
                        {object.price && <span className="text-[#FFDB00]">₹{object.price}</span>}
                    </div>
                </Html>
            )}
        </group>
    );
};

