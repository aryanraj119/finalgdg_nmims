export type RoomType = "Classroom" | "Office" | "Hospital" | "Gym" | "Living Room" | "Custom";

export interface SceneObject {
    id: string;
    productId?: string;
    type: "wall" | "floor" | "door" | "window" | "furniture";
    name: string;
    position: [number, number, number];
    rotation: [number, number, number]; // Radians or degrees
    scale?: [number, number, number];
    width?: number;
    depth?: number;
    height?: number;
    color?: string;
    modelUrl?: string;
    isColliding?: boolean;
    isOutOfRoom?: boolean;
    price?: number;
    condition?: string;
}

export interface RoomState {
    id: string;
    name: string;
    type: RoomType;
    width: number;  // X axis (meters)
    length: number; // Z axis (meters)
    height: number; // Y axis (meters)
    objects: SceneObject[];
    doorPosition?: [number, number, number];
    windowPosition?: [number, number, number];
    wallThickness?: number;
    createdAt?: string;
    updatedAt?: string;
}
