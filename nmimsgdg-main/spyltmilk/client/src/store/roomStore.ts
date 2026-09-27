import { create } from "zustand";
import type { RoomState, SceneObject, RoomType } from "../types/room";
import { ROOM_TEMPLATES } from "../data/rooms";
import { DEMO_CLASSROOM_SCENE, DEMO_LIVING_ROOM_SCENE } from "../data/demoScenes";
import { checkRoomCollisions, checkWalkingClearance } from "../three/CollisionSystem";

interface RoomStoreState {
    currentRoom: RoomState;
    selectedObjectId: string | null;
    history: RoomState[];
    historyIndex: number;
    collisions: Map<string, boolean>;
    clearanceWarning: string | null;

    // Actions
    setRoomDimensions: (width: number, length: number, height: number) => void;
    loadTemplate: (templateType: RoomType) => void;
    loadDemoClassroom: () => void;
    loadDemoLivingRoom: () => void;
    selectObject: (id: string | null) => void;
    addObject: (object: Omit<SceneObject, "id">) => string;
    updateObject: (id: string, updates: Partial<SceneObject>) => void;
    moveObject: (id: string, position: [number, number, number]) => void;
    rotateObject: (id: string, rotationY: number) => void;
    duplicateObject: (id: string) => void;
    deleteObject: (id: string) => void;
    clearRoom: () => void;
    undo: () => void;
    redo: () => void;
    validateRoomState: () => void;
}

const DEFAULT_ROOM: RoomState = ROOM_TEMPLATES["Living Room"];

export const useRoomStore = create<RoomStoreState>((set, get) => {
    const pushHistory = (newRoom: RoomState) => {
        const { history, historyIndex } = get();
        const updatedHistory = history.slice(0, historyIndex + 1);
        updatedHistory.push(newRoom);
        set({
            history: updatedHistory,
            historyIndex: updatedHistory.length - 1,
            currentRoom: newRoom
        });
        get().validateRoomState();
    };

    return {
        currentRoom: DEFAULT_ROOM,
        selectedObjectId: null,
        history: [DEFAULT_ROOM],
        historyIndex: 0,
        collisions: new Map(),
        clearanceWarning: null,

        setRoomDimensions: (width, length, height) => {
            const { currentRoom } = get();
            const updated = { ...currentRoom, width, length, height, updatedAt: new Date().toISOString() };
            pushHistory(updated);
        },

        loadTemplate: (templateType) => {
            const template = ROOM_TEMPLATES[templateType] || ROOM_TEMPLATES["Living Room"];
            const newRoom: RoomState = {
                ...template,
                id: `room-${Date.now()}`,
                objects: [],
                createdAt: new Date().toISOString()
            };
            set({ selectedObjectId: null });
            pushHistory(newRoom);
        },

        loadDemoClassroom: () => {
            set({ selectedObjectId: null });
            pushHistory(DEMO_CLASSROOM_SCENE);
        },

        loadDemoLivingRoom: () => {
            set({ selectedObjectId: null });
            pushHistory(DEMO_LIVING_ROOM_SCENE);
        },

        selectObject: (id) => {
            set({ selectedObjectId: id });
        },

        addObject: (objData) => {
            const { currentRoom } = get();
            const newId = `obj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
            const newObject: SceneObject = {
                ...objData,
                id: newId
            };
            const updated = {
                ...currentRoom,
                objects: [...currentRoom.objects, newObject],
                updatedAt: new Date().toISOString()
            };
            set({ selectedObjectId: newId });
            pushHistory(updated);
            return newId;
        },

        updateObject: (id, updates) => {
            const { currentRoom } = get();
            const updatedObjects = currentRoom.objects.map((obj) =>
                obj.id === id ? { ...obj, ...updates } : obj
            );
            const updated = { ...currentRoom, objects: updatedObjects, updatedAt: new Date().toISOString() };
            pushHistory(updated);
        },

        moveObject: (id, position) => {
            const { currentRoom } = get();
            const updatedObjects = currentRoom.objects.map((obj) =>
                obj.id === id ? { ...obj, position } : obj
            );
            const updated = { ...currentRoom, objects: updatedObjects, updatedAt: new Date().toISOString() };
            set({ currentRoom: updated });
            get().validateRoomState();
        },

        rotateObject: (id, rotationY) => {
            const { currentRoom } = get();
            const updatedObjects = currentRoom.objects.map((obj) =>
                obj.id === id
                    ? { ...obj, rotation: [obj.rotation[0], rotationY, obj.rotation[2]] as [number, number, number] }
                    : obj
            );
            const updated = { ...currentRoom, objects: updatedObjects, updatedAt: new Date().toISOString() };
            pushHistory(updated);
        },

        duplicateObject: (id) => {
            const { currentRoom } = get();
            const target = currentRoom.objects.find((o) => o.id === id);
            if (!target) return;

            const newId = `obj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
            const offsetPos: [number, number, number] = [
                target.position[0] + 0.3,
                target.position[1],
                target.position[2] + 0.3
            ];

            const duplicated: SceneObject = {
                ...target,
                id: newId,
                name: `${target.name} (Copy)`,
                position: offsetPos
            };

            const updated = {
                ...currentRoom,
                objects: [...currentRoom.objects, duplicated],
                updatedAt: new Date().toISOString()
            };
            set({ selectedObjectId: newId });
            pushHistory(updated);
        },

        deleteObject: (id) => {
            const { currentRoom, selectedObjectId } = get();
            const updatedObjects = currentRoom.objects.filter((obj) => obj.id !== id);
            const updated = { ...currentRoom, objects: updatedObjects, updatedAt: new Date().toISOString() };

            if (selectedObjectId === id) {
                set({ selectedObjectId: null });
            }
            pushHistory(updated);
        },

        clearRoom: () => {
            const { currentRoom } = get();
            const updated = { ...currentRoom, objects: [], updatedAt: new Date().toISOString() };
            set({ selectedObjectId: null });
            pushHistory(updated);
        },

        undo: () => {
            const { history, historyIndex } = get();
            if (historyIndex > 0) {
                const prevIndex = historyIndex - 1;
                set({
                    historyIndex: prevIndex,
                    currentRoom: history[prevIndex]
                });
                get().validateRoomState();
            }
        },

        redo: () => {
            const { history, historyIndex } = get();
            if (historyIndex < history.length - 1) {
                const nextIndex = historyIndex + 1;
                set({
                    historyIndex: nextIndex,
                    currentRoom: history[nextIndex]
                });
                get().validateRoomState();
            }
        },

        validateRoomState: () => {
            const { currentRoom } = get();
            const { collisionsMap } = checkRoomCollisions(currentRoom);
            const clearanceMsg = checkWalkingClearance(currentRoom);
            set({ collisions: collisionsMap, clearanceWarning: clearanceMsg });
        }
    };
});
