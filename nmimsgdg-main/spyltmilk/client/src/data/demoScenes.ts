import type { RoomState, SceneObject } from "../types/room";

export const DEMO_CLASSROOM_SCENE: RoomState = {
    id: "demo-classroom-30",
    name: "Classroom (30 Students)",
    type: "Classroom",
    width: 8.0,
    length: 6.0,
    height: 3.0,
    wallThickness: 0.15,
    doorPosition: [3.8, 0, 2.8],
    windowPosition: [-3.8, 0, 0],
    objects: ((): SceneObject[] => {
        const objs: SceneObject[] = [];
        let idCounter = 1;

        // Teacher Desk at front
        objs.push({
            id: `obj-teacher-desk`,
            productId: "desk-001",
            type: "furniture",
            name: "Teacher Desk",
            position: [0, 0, -2.2],
            rotation: [0, 0, 0],
            width: 1.2,
            depth: 0.6,
            height: 0.75,
            color: "#C5A070",
            price: 3800,
            condition: "Like New"
        });

        // Teacher Chair
        objs.push({
            id: `obj-teacher-chair`,
            productId: "chair-003",
            type: "furniture",
            name: "Teacher Chair",
            position: [0, 0, -2.7],
            rotation: [0, 0, 0],
            width: 0.65,
            depth: 0.65,
            height: 1.15,
            color: "#2B2D42",
            price: 3200,
            condition: "Good"
        });

        // 30 Student Desks & Chairs arranged in 5 columns x 6 rows
        const startX = -2.6;
        const startZ = -1.2;
        const gapX = 1.3;
        const gapZ = 0.8;

        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 6; col++) {
                const posX = startX + row * gapX;
                const posZ = startZ + col * gapZ;

                // Student Desk
                objs.push({
                    id: `obj-sdesk-${idCounter}`,
                    productId: "desk-002",
                    type: "furniture",
                    name: `Student Desk ${idCounter}`,
                    position: [posX, 0, posZ],
                    rotation: [0, 0, 0],
                    width: 0.7,
                    depth: 0.5,
                    height: 0.74,
                    color: "#D8C7B0",
                    price: 1100,
                    condition: "Good"
                });

                // Student Chair
                objs.push({
                    id: `obj-schair-${idCounter}`,
                    productId: "chair-004",
                    type: "furniture",
                    name: `Student Chair ${idCounter}`,
                    position: [posX, 0, posZ + 0.35],
                    rotation: [0, 0, 0],
                    width: 0.45,
                    depth: 0.48,
                    height: 0.78,
                    color: "#3A5A40",
                    price: 750,
                    condition: "Good"
                });

                idCounter++;
            }
        }

        // Storage cabinet back corner
        objs.push({
            id: `obj-storage-back`,
            productId: "storage-003",
            type: "furniture",
            name: "Classroom Supply Storage",
            position: [3.3, 0, 2.2],
            rotation: [0, -Math.PI / 2, 0],
            width: 0.9,
            depth: 0.4,
            height: 1.2,
            color: "#374151",
            price: 4100,
            condition: "Good"
        });

        return objs;
    })()
};

export const DEMO_LIVING_ROOM_SCENE: RoomState = {
    id: "demo-living-room",
    name: "Nordic Living Room Demo",
    type: "Living Room",
    width: 6.5,
    length: 5.0,
    height: 2.8,
    wallThickness: 0.15,
    objects: [
        {
            id: "obj-sofa-main",
            productId: "sofa-001",
            type: "furniture",
            name: "Scandi 3-Seater Sofa",
            position: [0, 0, -1.2],
            rotation: [0, 0, 0],
            width: 2.1,
            depth: 0.88,
            height: 0.82,
            color: "#4F5D65",
            price: 14500,
            condition: "Excellent"
        },
        {
            id: "obj-[#coffee-table]",
            productId: "table-002",
            type: "furniture",
            name: "Minimalist Round Coffee Table",
            position: [0, 0, -0.1],
            rotation: [0, 0, 0],
            width: 0.75,
            depth: 0.75,
            height: 0.42,
            color: "#F4F4F6",
            price: 1950,
            condition: "Like New"
        },
        {
            id: "obj-armchair-accent",
            productId: "chair-002",
            type: "furniture",
            name: "Nordic Soft Linen Armchair",
            position: [-1.8, 0, -0.2],
            rotation: [0, Math.PI / 4, 0],
            width: 0.8,
            depth: 0.75,
            height: 0.9,
            color: "#E2D8CE",
            price: 4500,
            condition: "Like New"
        },
        {
            id: "obj-bookshelf",
            productId: "storage-001",
            type: "furniture",
            name: "Modular 4x2 Cube Shelving Unit",
            position: [2.7, 0, 0],
            rotation: [0, -Math.PI / 2, 0],
            width: 0.77,
            depth: 0.39,
            height: 1.47,
            color: "#FAFAFA",
            price: 2600,
            condition: "Like New"
        },
        {
            id: "obj-lamp",
            productId: "light-001",
            type: "furniture",
            name: "Arch Floor Lamp",
            position: [1.6, 0, -1.5],
            rotation: [0, -Math.PI / 4, 0],
            width: 0.4,
            depth: 0.8,
            height: 1.75,
            color: "#D4AF37",
            price: 2200,
            condition: "Like New"
        }
    ]
};
