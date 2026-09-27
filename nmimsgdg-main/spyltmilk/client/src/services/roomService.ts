import type { RoomState } from "../types/room";
import { ROOM_TEMPLATES } from "../data/rooms";

const STORAGE_KEY = "ikea_spylt_saved_rooms_v1";

export class RoomService {
    async getSavedRooms(): Promise<RoomState[]> {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    async getRoomById(id: string): Promise<RoomState | undefined> {
        const rooms = await this.getSavedRooms();
        return rooms.find((r) => r.id === id);
    }

    async saveRoom(room: RoomState): Promise<RoomState> {
        const rooms = await this.getSavedRooms();
        const existingIndex = rooms.findIndex((r) => r.id === room.id);
        const updatedRoom = { ...room, updatedAt: new Date().toISOString() };

        if (existingIndex >= 0) {
            rooms[existingIndex] = updatedRoom;
        } else {
            rooms.push(updatedRoom);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
        return updatedRoom;
    }

    async deleteRoom(id: string): Promise<boolean> {
        const rooms = await this.getSavedRooms();
        const filtered = rooms.filter((r) => r.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        return true;
    }

    getTemplates(): Record<string, RoomState> {
        return ROOM_TEMPLATES;
    }
}

export const roomService = new RoomService();
