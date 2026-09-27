import { create } from "zustand";

export type ViewMode = "3D" | "2D" | "FirstPerson";
export type MeasurementUnit = "Meters" | "Centimeters" | "Feet" | "Inches";

interface UIStoreState {
    viewMode: ViewMode;
    unit: MeasurementUnit;
    sizeMode: "L" | "M";
    depthMapActive: boolean;
    isAiModalOpen: boolean;
    isScanModalOpen: boolean;
    isArModalOpen: boolean;
    toastMessage: string | null;

    // Actions
    setViewMode: (mode: ViewMode) => void;
    setUnit: (unit: MeasurementUnit) => void;
    setSizeMode: (mode: "L" | "M") => void;
    toggleDepthMap: () => void;
    setAiModalOpen: (isOpen: boolean) => void;
    setScanModalOpen: (isOpen: boolean) => void;
    setArModalOpen: (isOpen: boolean) => void;
    showToast: (message: string) => void;
    clearToast: () => void;
}

export const useUIStore = create<UIStoreState>((set) => ({
    viewMode: "3D",
    unit: "Meters",
    sizeMode: "L",
    depthMapActive: false,
    isAiModalOpen: false,
    isScanModalOpen: false,
    isArModalOpen: false,
    toastMessage: null,

    setViewMode: (mode) => set({ viewMode: mode }),
    setUnit: (unit) => set({ unit }),
    setSizeMode: (mode) => set({ sizeMode: mode }),
    toggleDepthMap: () => set((state) => ({ depthMapActive: !state.depthMapActive })),
    setAiModalOpen: (isOpen) => set({ isAiModalOpen: isOpen }),
    setScanModalOpen: (isOpen) => set({ isScanModalOpen: isOpen }),
    setArModalOpen: (isOpen) => set({ isArModalOpen: isOpen }),

    showToast: (message) => {
        set({ toastMessage: message });
        setTimeout(() => {
            set({ toastMessage: null });
        }, 3500);
    },
    clearToast: () => set({ toastMessage: null })
}));
