export type LayoutAction =
    | {
        type: "add";
        productId: string;
        quantity?: number;
        position?: [number, number, number];
        rotationY?: number;
    }
    | {
        type: "move";
        objectId: string;
        position: [number, number, number];
    }
    | {
        type: "rotate";
        objectId: string;
        rotationY: number;
    }
    | {
        type: "delete";
        objectId: string;
    }
    | {
        type: "duplicate";
        objectId: string;
        quantity: number;
    }
    | {
        type: "replace";
        objectId: string;
        productId: string;
    };

export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
}
