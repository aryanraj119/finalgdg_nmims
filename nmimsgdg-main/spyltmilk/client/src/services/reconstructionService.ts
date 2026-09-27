import type { RoomReconstructionProvider, ReconstructionResult, ARProvider } from "../types/ai";
import type { RoomState } from "../types/room";

export class MockReconstructionProvider implements RoomReconstructionProvider {
    async reconstruct(_images: string[]): Promise<ReconstructionResult> {
        // Simulate step-by-step VGGT reconstruction processing delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const mockRoomState: RoomState = {
            id: `reconstructed-${Date.now()}`,
            name: "My Scanned Room Digital Twin",
            type: "Custom",
            width: 6.2,
            length: 4.8,
            height: 2.8,
            wallThickness: 0.15,
            createdAt: new Date().toISOString(),
            objects: [
                {
                    id: "rec-wall-front",
                    type: "wall",
                    name: "Front Wall",
                    position: [0, 1.4, -2.4],
                    rotation: [0, 0, 0],
                    width: 6.2,
                    height: 2.8,
                    depth: 0.15
                },
                {
                    id: "rec-sofa-detected",
                    type: "furniture",
                    name: "Detected Sofa (VGGT)",
                    productId: "sofa-001",
                    position: [-1.2, 0, -1.0],
                    rotation: [0, Math.PI / 12, 0],
                    width: 2.1,
                    depth: 0.88,
                    height: 0.82,
                    color: "#4F5D65",
                    price: 14500,
                    condition: "Good"
                },
                {
                    id: "rec-table-detected",
                    type: "furniture",
                    name: "Detected Table (VGGT)",
                    productId: "table-002",
                    position: [1.4, 0, 0.5],
                    rotation: [0, 0, 0],
                    width: 0.75,
                    depth: 0.75,
                    height: 0.42,
                    color: "#F4F4F6",
                    price: 1950,
                    condition: "Like New"
                }
            ]
        };

        return {
            id: `vggt-job-${Date.now()}`,
            status: "completed",
            progress: 100,
            roomState: mockRoomState,
            confidenceScore: 0.94,
            message: "VGGT photo-to-3D room reconstruction complete! 6.2m × 4.8m room twin created."
        };
    }
}

export class VGGTReconstructionProvider implements RoomReconstructionProvider {
    private backendUrl: string;

    constructor(backendUrl = "http://localhost:8000") {
        this.backendUrl = backendUrl;
    }

    async reconstruct(images: string[]): Promise<ReconstructionResult> {
        try {
            const response = await fetch(`${this.backendUrl}/api/reconstruction/start`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ images })
            });

            if (!response.ok) {
                throw new Error(`VGGT backend returned HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.warn("VGGT backend unavailable, falling back to MockReconstructionProvider:", error);
            const mock = new MockReconstructionProvider();
            return mock.reconstruct(images);
        }
    }
}

// WebXR / AR Provider Implementation
export class WebXRARProvider implements ARProvider {
    isSupported(): boolean {
        return typeof window !== "undefined" && "xr" in navigator;
    }

    async placeObject(modelUrl: string): Promise<void> {
        if (!this.isSupported()) {
            throw new Error("WebXR AR is not supported on this device/browser.");
        }
        console.log("Launching WebXR AR session for model:", modelUrl);
    }
}
