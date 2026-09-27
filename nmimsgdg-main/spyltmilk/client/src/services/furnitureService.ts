import type { Furniture, FurnitureCategory } from "../types/furniture";
import { DEMO_FURNITURE } from "../data/furniture";

export class FurnitureService {
    private furnitureList: Furniture[] = DEMO_FURNITURE;

    async getAllFurniture(): Promise<Furniture[]> {
        return Promise.resolve(this.furnitureList);
    }

    async getFurnitureById(id: string): Promise<Furniture | undefined> {
        return Promise.resolve(this.furnitureList.find((f) => f.id === id));
    }

    async getByCategory(category: FurnitureCategory): Promise<Furniture[]> {
        if (category === "All") return Promise.resolve(this.furnitureList);
        return Promise.resolve(this.furnitureList.filter((f) => f.category === category));
    }

    async searchFurniture(query: string, maxPrice?: number): Promise<Furniture[]> {
        const q = query.toLowerCase();
        return Promise.resolve(
            this.furnitureList.filter((f) => {
                const matchSearch =
                    f.name.toLowerCase().includes(q) ||
                    f.description.toLowerCase().includes(q) ||
                    f.category.toLowerCase().includes(q);
                const matchPrice = maxPrice ? f.price <= maxPrice : true;
                return matchSearch && matchPrice;
            })
        );
    }
}

export const furnitureService = new FurnitureService();
