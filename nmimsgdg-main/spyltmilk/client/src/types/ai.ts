import type { RoomState } from "./room";
import type { Furniture } from "./furniture";
import type { LayoutAction } from "./layout";

export interface AIResponse {
    explanation: string;
    actions: LayoutAction[];
    estimatedCost: number;
    itemCount: number;
}

export interface RoomAI {
    generateLayout(
        request: string,
        room: RoomState,
        inventory: Furniture[]
    ): Promise<AIResponse>;
}

export interface ReconstructionResult {
    id: string;
    status: "processing" | "completed" | "failed";
    progress: number;
    roomState?: RoomState;
    glbUrl?: string;
    confidenceScore?: number;
    message?: string;
}

export interface RoomReconstructionProvider {
    reconstruct(images: string[]): Promise<ReconstructionResult>;
}

export interface ARProvider {
    isSupported(): boolean;
    placeObject(modelUrl: string): Promise<void>;
}
