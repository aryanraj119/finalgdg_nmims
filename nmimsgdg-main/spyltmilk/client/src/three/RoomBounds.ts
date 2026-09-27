import type { RoomState } from "../types/room";

export function isPositionWithinRoom(
    position: [number, number, number],
    width: number,
    depth: number,
    room: RoomState
): boolean {
    const halfRoomW = room.width / 2;
    const halfRoomL = room.length / 2;

    const [x, , z] = position;
    const halfW = width / 2;
    const halfD = depth / 2;

    return (
        x - halfW >= -halfRoomW &&
        x + halfW <= halfRoomW &&
        z - halfD >= -halfRoomL &&
        z + halfD <= halfRoomL
    );
}

export function clampPositionToRoom(
    position: [number, number, number],
    width: number,
    depth: number,
    room: RoomState
): [number, number, number] {
    const halfRoomW = room.width / 2 - width / 2;
    const halfRoomL = room.length / 2 - depth / 2;

    const clampedX = Math.max(-halfRoomW, Math.min(halfRoomW, position[0]));
    const clampedZ = Math.max(-halfRoomL, Math.min(halfRoomL, position[2]));

    return [clampedX, position[1], clampedZ];
}
