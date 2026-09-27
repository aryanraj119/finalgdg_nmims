import type { RoomState, SceneObject } from "../types/room";

export interface CollisionCheckResult {
    hasCollisions: boolean;
    collisionsMap: Map<string, boolean>;
    collidingPairs: Array<[string, string]>;
}

// Bounding box calculation for 3D box with Y-axis rotation
export function getOrientedBoundingBox(obj: SceneObject) {
    const width = obj.width || 0.6;
    const depth = obj.depth || 0.6;
    const height = obj.height || 0.8;

    const [posX, posY, posZ] = obj.position;
    const rotY = obj.rotation ? obj.rotation[1] : 0;

    const halfW = width / 2;
    const halfD = depth / 2;

    const cos = Math.cos(rotY);
    const sin = Math.sin(rotY);

    // Calculate min/max bounds in world space
    const minX = posX - Math.abs(halfW * cos) - Math.abs(halfD * sin);
    const maxX = posX + Math.abs(halfW * cos) + Math.abs(halfD * sin);
    const minZ = posZ - Math.abs(halfW * sin) - Math.abs(halfD * cos);
    const maxZ = posZ + Math.abs(halfW * sin) + Math.abs(halfD * cos);

    return {
        id: obj.id,
        minX,
        maxX,
        minZ,
        maxZ,
        minY: posY,
        maxY: posY + height,
        posX,
        posZ,
        width,
        depth,
        height
    };
}

export function checkRoomCollisions(room: RoomState): CollisionCheckResult {
    const collisionsMap = new Map<string, boolean>();
    const collidingPairs: Array<[string, string]> = [];

    const boxes = room.objects.map(getOrientedBoundingBox);

    // 1. Room boundary check
    const halfRoomW = room.width / 2;
    const halfRoomL = room.length / 2;

    boxes.forEach((box) => {
        const isOutside =
            box.minX < -halfRoomW ||
            box.maxX > halfRoomW ||
            box.minZ < -halfRoomL ||
            box.maxZ > halfRoomL;

        if (isOutside) {
            collisionsMap.set(box.id, true);
        }
    });

    // 2. Object vs Object collision check (AABB overlap)
    for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
            const a = boxes[i];
            const b = boxes[j];

            const overlapX = a.minX < b.maxX && a.maxX > b.minX;
            const overlapZ = a.minZ < b.maxZ && a.maxZ > b.minZ;
            const overlapY = a.minY < b.maxY && a.maxY > b.minY;

            if (overlapX && overlapZ && overlapY) {
                collisionsMap.set(a.id, true);
                collisionsMap.set(b.id, true);
                collidingPairs.push([a.id, b.id]);
            }
        }
    }

    return {
        hasCollisions: collisionsMap.size > 0,
        collisionsMap,
        collidingPairs
    };
}

export function checkWalkingClearance(room: RoomState, minClearance = 0.9): string | null {
    if (room.objects.length < 2) return null;

    const boxes = room.objects.map(getOrientedBoundingBox);

    for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
            const a = boxes[i];
            const b = boxes[j];

            // Distance between center points
            const dist = Math.hypot(a.posX - b.posX, a.posZ - b.posZ);
            const radiusA = Math.hypot(a.width, a.depth) / 2;
            const radiusB = Math.hypot(b.width, b.depth) / 2;

            const gap = dist - (radiusA + radiusB);

            if (gap > 0 && gap < minClearance) {
                const objA = room.objects.find((o) => o.id === a.id);
                const objB = room.objects.find((o) => o.id === b.id);
                return `⚠ Walking clearance too narrow (${gap.toFixed(2)}m) between ${objA?.name || "item"} and ${objB?.name || "item"}`;
            }
        }
    }

    return null;
}
