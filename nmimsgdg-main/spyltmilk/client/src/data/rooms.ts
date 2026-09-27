import type { RoomState } from "../types/room";

export const ROOM_TEMPLATES: Record<string, RoomState> = {
    Classroom: {
        id: "tpl-classroom",
        name: "Standard Classroom",
        type: "Classroom",
        width: 8.0,
        length: 6.0,
        height: 3.0,
        objects: [],
        doorPosition: [4.0, 0, 3.0],
        windowPosition: [-4.0, 0, 0],
        wallThickness: 0.15
    },
    Office: {
        id: "tpl-office",
        name: "Corporate Office Suite",
        type: "Office",
        width: 7.0,
        length: 5.5,
        height: 2.8,
        objects: [],
        doorPosition: [3.5, 0, 2.75],
        windowPosition: [-3.5, 0, 0],
        wallThickness: 0.15
    },
    Hospital: {
        id: "tpl-hospital",
        name: "Patient Recovery Room",
        type: "Hospital",
        width: 5.0,
        length: 4.5,
        height: 3.0,
        objects: [],
        doorPosition: [2.5, 0, 2.25],
        windowPosition: [-2.5, 0, 0],
        wallThickness: 0.15
    },
    Gym: {
        id: "tpl-gym",
        name: "Fitness Studio Space",
        type: "Gym",
        width: 9.0,
        length: 7.0,
        height: 3.5,
        objects: [],
        doorPosition: [4.5, 0, 3.5],
        windowPosition: [-4.5, 0, 0],
        wallThickness: 0.15
    },
    "Living Room": {
        id: "tpl-living",
        name: "Scandinavian Living Room",
        type: "Living Room",
        width: 6.5,
        length: 5.0,
        height: 2.8,
        objects: [],
        doorPosition: [3.25, 0, 2.5],
        windowPosition: [-3.25, 0, 0],
        wallThickness: 0.15
    }
};
