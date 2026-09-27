export type FurnitureCondition = "Like New" | "Excellent" | "Good" | "Fair";

export type FurnitureCategory =
    | "All"
    | "Chairs"
    | "Desks"
    | "Tables"
    | "Sofas"
    | "Beds"
    | "Cabinets"
    | "Shelves"
    | "Storage"
    | "Lighting"
    | "Office"
    | "Classroom"
    | "Hospital"
    | "Outdoor";

export interface Furniture {
    id: string;
    name: string;
    category: FurnitureCategory;
    price: number;
    originalPrice?: number;
    condition: FurnitureCondition;
    width: number;
    depth: number;
    height: number;
    modelUrl?: string;
    thumbnailUrl?: string;
    sellerId: string;
    sellerName: string;
    location: string;
    available: boolean;
    description: string;
    color?: string;
    material?: string;
    tags?: string[];
}
