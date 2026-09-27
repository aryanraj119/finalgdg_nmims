import { create } from "zustand";
import type { Furniture, FurnitureCategory, FurnitureCondition } from "../types/furniture";
import { DEMO_FURNITURE } from "../data/furniture";

interface FurnitureStoreState {
    catalog: Furniture[];
    selectedCategory: FurnitureCategory;
    selectedCondition: FurnitureCondition | "All";
    searchQuery: string;
    maxPrice: number;
    cart: Furniture[];

    // Actions
    setCategory: (category: FurnitureCategory) => void;
    setCondition: (condition: FurnitureCondition | "All") => void;
    setSearchQuery: (query: string) => void;
    setMaxPrice: (price: number) => void;
    addToCart: (furniture: Furniture) => void;
    removeFromCart: (furnitureId: string) => void;
    getFilteredFurniture: () => Furniture[];
}

export const useFurnitureStore = create<FurnitureStoreState>((set, get) => ({
    catalog: DEMO_FURNITURE,
    selectedCategory: "All",
    selectedCondition: "All",
    searchQuery: "",
    maxPrice: 50000,
    cart: [],

    setCategory: (category) => set({ selectedCategory: category }),
    setCondition: (condition) => set({ selectedCondition: condition }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setMaxPrice: (price) => set({ maxPrice: price }),

    addToCart: (furniture) => {
        const { cart } = get();
        if (!cart.some((item) => item.id === furniture.id)) {
            set({ cart: [...cart, furniture] });
        }
    },

    removeFromCart: (furnitureId) => {
        set({ cart: get().cart.filter((item) => item.id !== furnitureId) });
    },

    getFilteredFurniture: () => {
        const { catalog, selectedCategory, selectedCondition, searchQuery, maxPrice } = get();
        return catalog.filter((item) => {
            const matchCategory = selectedCategory === "All" || item.category === selectedCategory;
            const matchCondition = selectedCondition === "All" || item.condition === selectedCondition;
            const matchPrice = item.price <= maxPrice;
            const matchSearch =
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

            return matchCategory && matchCondition && matchPrice && matchSearch;
        });
    }
}));
