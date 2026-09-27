import type { RoomAI, AIResponse } from "../types/ai";
import type { RoomState } from "../types/room";
import type { Furniture } from "../types/furniture";
import type { LayoutAction, ValidationResult } from "../types/layout";

// Action Validation Layer
export function validateLayoutAction(
    action: LayoutAction,
    room: RoomState,
    inventory: Furniture[]
): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (action.type === "add" || action.type === "replace") {
        const productExists = inventory.some((item) => item.id === action.productId);
        if (!productExists) {
            errors.push(`Invalid product ID: ${action.productId}`);
        }
    }

    if (action.type === "add" && action.position) {
        const [x, , z] = action.position;
        const halfW = room.width / 2;
        const halfL = room.length / 2;

        if (Math.abs(x) > halfW || Math.abs(z) > halfL) {
            errors.push(`Position [${x}, ${z}] is outside room boundary (${room.width}m x ${room.length}m)`);
        }
    }

    if (action.type === "move") {
        const objExists = room.objects.some((o) => o.id === action.objectId);
        if (!objExists) {
            warnings.push(`Target object ${action.objectId} does not exist in scene`);
        }
    }

    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}

// Mock AI Provider (Production Fallback)
export class MockRoomAI implements RoomAI {
    async generateLayout(
        request: string,
        room: RoomState,
        inventory: Furniture[]
    ): Promise<AIResponse> {
        const reqLower = request.toLowerCase();
        const actions: LayoutAction[] = [];

        // 1. Classroom request logic
        if (reqLower.includes("classroom") || reqLower.includes("student")) {
            const deskItem = inventory.find((i) => i.id === "desk-002") || inventory[0];
            const chairItem = inventory.find((i) => i.id === "chair-004") || inventory[1];

            // Teacher setup
            actions.push({
                type: "add",
                productId: "desk-001",
                position: [0, 0, -room.length / 2 + 1.0],
                rotationY: 0
            });
            actions.push({
                type: "add",
                productId: "chair-003",
                position: [0, 0, -room.length / 2 + 0.4],
                rotationY: 0
            });

            // Student grid setup
            const cols = 5;
            const rows = 4;
            const gapX = (room.width - 1.5) / cols;
            const gapZ = (room.length - 2.5) / rows;
            const startX = -room.width / 2 + 1.0;
            const startZ = -room.length / 2 + 2.0;

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const posX = startX + c * gapX;
                    const posZ = startZ + r * gapZ;

                    actions.push({
                        type: "add",
                        productId: deskItem.id,
                        position: [posX, 0, posZ],
                        rotationY: 0
                    });
                    actions.push({
                        type: "add",
                        productId: chairItem.id,
                        position: [posX, 0, posZ + 0.35],
                        rotationY: 0
                    });
                }
            }

            const totalCost = 3800 + 3200 + (rows * cols * (deskItem.price + chairItem.price));

            return {
                explanation: `Generated a structured ${room.type} layout with teacher desk at front and ${rows * cols} student desk/chair pairs with 0.9m walking aisles.`,
                actions,
                estimatedCost: totalCost,
                itemCount: 2 + (rows * cols * 2)
            };
        }

        // 2. Office setup logic
        if (reqLower.includes("office") || reqLower.includes("work")) {
            actions.push({
                type: "add",
                productId: "desk-003",
                position: [0, 0, -1.0],
                rotationY: 0
            });
            actions.push({
                type: "add",
                productId: "chair-003",
                position: [0, 0, -1.8],
                rotationY: 0
            });
            actions.push({
                type: "add",
                productId: "storage-003",
                position: [room.width / 2 - 0.6, 0, 0],
                rotationY: -Math.PI / 2
            });

            return {
                explanation: `Furnished executive office layout with standing desk, ergonomic chair, and steel storage cabinet.`,
                actions,
                estimatedCost: 12500 + 3200 + 4100,
                itemCount: 3
            };
        }

        // 3. Living Room default logic
        actions.push({
            type: "add",
            productId: "sofa-001",
            position: [0, 0, -1.2],
            rotationY: 0
        });
        actions.push({
            type: "add",
            productId: "table-002",
            position: [0, 0, -0.1],
            rotationY: 0
        });
        actions.push({
            type: "add",
            productId: "chair-002",
            position: [-1.8, 0, -0.2],
            rotationY: Math.PI / 4
        });
        actions.push({
            type: "add",
            productId: "light-001",
            position: [1.6, 0, -1.5],
            rotationY: -Math.PI / 4
        });

        return {
            explanation: `Arranged a cozy Scandinavian living space with 3-seater sofa, coffee table, accent chair, and arc floor lamp.`,
            actions,
            estimatedCost: 14500 + 1950 + 4500 + 2200,
            itemCount: 4
        };
    }
}

// Nemotron / Local LLM Provider via Ollama API
export class NemotronRoomAI implements RoomAI {
    private ollamaUrl: string;
    private modelName: string;

    constructor(ollamaUrl = "http://localhost:11434", modelName = "nemotron-mini") {
        this.ollamaUrl = ollamaUrl;
        this.modelName = modelName;
    }

    async generateLayout(
        request: string,
        room: RoomState,
        inventory: Furniture[]
    ): Promise<AIResponse> {
        try {
            const prompt = `You are a 3D interior design AI. Output JSON only.
Room dimensions: Width=${room.width}m, Length=${room.length}m, Height=${room.height}m.
Available furniture inventory:
${inventory.map((i) => `ID: ${i.id}, Name: ${i.name}, Price: ₹${i.price}, Category: ${i.category}, Dimensions: ${i.width}x${i.depth}x${i.height}m`).join("\n")}

User request: "${request}"

Return JSON matching format:
{
  "explanation": "Brief description of the design decisions",
  "actions": [
    {"type": "add", "productId": "chair-001", "position": [0, 0, 0], "rotationY": 0}
  ]
}`;

            const response = await fetch(`${this.ollamaUrl}/api/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: this.modelName,
                    prompt: prompt,
                    stream: false,
                    format: "json"
                })
            });

            if (!response.ok) {
                throw new Error(`Ollama API returned HTTP ${response.status}`);
            }

            const data = await response.json();
            const parsed = JSON.parse(data.response);

            // Filter & validate every action
            const validActions: LayoutAction[] = [];
            let totalCost = 0;

            for (const action of parsed.actions || []) {
                const validation = validateLayoutAction(action, room, inventory);
                if (validation.valid) {
                    validActions.push(action);
                    if (action.type === "add") {
                        const item = inventory.find((i) => i.id === action.productId);
                        if (item) totalCost += item.price;
                    }
                }
            }

            return {
                explanation: parsed.explanation || "Nemotron generated layout",
                actions: validActions,
                estimatedCost: totalCost,
                itemCount: validActions.length
            };
        } catch (error) {
            console.warn("Nemotron/Ollama unavailable, falling back to MockRoomAI:", error);
            const mock = new MockRoomAI();
            return mock.generateLayout(request, room, inventory);
        }
    }
}
