import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "../components/ui/Navbar";
import { RoomScene } from "../three/RoomScene";
import { RoomPlannerControls } from "../components/planner/RoomPlannerControls";
import { InspectorSidebar } from "../components/planner/InspectorSidebar";
import { AIFurnishModal } from "../components/ai/AIFurnishModal";
import { ScanRoomModal } from "../components/ai/ScanRoomModal";
import { useRoomStore } from "../store/roomStore";
import { useFurnitureStore } from "../store/furnitureStore";
import { useUIStore } from "../store/uiStore";
import type { RoomType } from "../types/room";

export const Planner: React.FC = () => {
    const [searchParams] = useSearchParams();

    const currentRoom = useRoomStore((state) => state.currentRoom);
    const setRoomDimensions = useRoomStore((state) => state.setRoomDimensions);
    const loadTemplate = useRoomStore((state) => state.loadTemplate);
    const loadDemoClassroom = useRoomStore((state) => state.loadDemoClassroom);
    const loadDemoLivingRoom = useRoomStore((state) => state.loadDemoLivingRoom);
    const addObject = useRoomStore((state) => state.addObject);
    const clearRoom = useRoomStore((state) => state.clearRoom);
    const clearanceWarning = useRoomStore((state) => state.clearanceWarning);

    const catalog = useFurnitureStore((state) => state.catalog);
    const selectedCategory = useFurnitureStore((state) => state.selectedCategory);
    const setCategory = useFurnitureStore((state) => state.setCategory);

    const viewMode = useUIStore((state) => state.viewMode);
    const setViewMode = useUIStore((state) => state.setViewMode);
    const setAiModalOpen = useUIStore((state) => state.setAiModalOpen);
    const setScanModalOpen = useUIStore((state) => state.setScanModalOpen);
    const setArModalOpen = useUIStore((state) => state.setArModalOpen);
    const toastMessage = useUIStore((state) => state.toastMessage);
    const showToast = useUIStore((state) => state.showToast);

    const [isDimensionsOpen, setIsDimensionsOpen] = useState(false);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.name.toLowerCase().endsWith(".obj")) {
            showToast("Please select a valid .OBJ 3D file.");
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        const cleanName = file.name.replace(/\.obj$/i, "");

        addObject({
            type: "furniture",
            name: cleanName || "Custom OBJ Model",
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            width: 1.0,
            depth: 1.0,
            height: 1.0,
            color: "#38BDF8",
            modelUrl: objectUrl,
            price: 999,
            condition: "Uploaded 3D Asset"
        });

        showToast(`Loaded "${cleanName}.obj" into 3D Planner!`);
        e.target.value = "";
    };

    // Auto-load demo scenario if query param present
    useEffect(() => {
        const demoParam = searchParams.get("demo");
        if (demoParam === "classroom") {
            loadDemoClassroom();
            showToast("Loaded Classroom Demo Room (30 Students)");
        } else if (demoParam === "living") {
            loadDemoLivingRoom();
            showToast("Loaded Scandinavian Living Room Demo");
        }
    }, [searchParams]);

    // Subtotal calculation
    const totalCost = currentRoom.objects.reduce((acc, obj) => acc + (obj.price || 0), 0);
    const filteredCatalog = catalog.filter(
        (item) => selectedCategory === "All" || item.category === selectedCategory
    );

    return (
        <div className="h-screen flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden">
            <Navbar />

            {/* Notification Toast */}
            {toastMessage && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#0058A3] text-white px-6 py-3 rounded-full text-xs font-bold shadow-2xl animate-bounce flex items-center space-x-2 border border-blue-400/40">
                    <span className="bg-[#FFDB00] text-black w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black">✓</span>
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Clearance Warning Banner */}
            {clearanceWarning && (
                <div className="bg-amber-500 text-slate-950 font-extrabold text-xs px-4 py-2 text-center shadow-md flex items-center justify-center space-x-2 z-20">
                    <span>{clearanceWarning}</span>
                </div>
            )}

            {/* MAIN PLANNER LAYOUT */}
            <div className="flex-1 flex overflow-hidden relative">

                {/* LEFT PALETTE & ROOM SETTINGS SIDEBAR */}
                <aside className="w-80 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between overflow-y-auto z-10 text-slate-200">
                    <div className="space-y-5">

                        {/* Room Template Selector */}
                        <div>
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FFDB00] block mb-2">
                                1. Select Room Template
                            </span>
                            <div className="grid grid-cols-2 gap-1.5">
                                {["Classroom", "Office", "Hospital", "Gym", "Living Room"].map((tpl) => (
                                    <button
                                        key={tpl}
                                        onClick={() => {
                                            loadTemplate(tpl as RoomType);
                                            showToast(`Loaded ${tpl} template`);
                                        }}
                                        className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${currentRoom.type === tpl
                                                ? "bg-[#0058A3] text-white shadow-md"
                                                : "bg-slate-800/80 hover:bg-slate-700 text-slate-300"
                                            }`}
                                    >
                                        {tpl}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Custom Dimensions Editor */}
                        <div className="bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/60 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase text-slate-300">Room Size</span>
                                <button
                                    onClick={() => setIsDimensionsOpen(!isDimensionsOpen)}
                                    className="text-[10px] text-[#FFDB00] font-semibold hover:underline"
                                >
                                    {isDimensionsOpen ? "Close" : "Edit Dimensions"}
                                </button>
                            </div>

                            <div className="text-xs font-mono font-bold text-slate-300">
                                {currentRoom.width}m (W) × {currentRoom.length}m (L) × {currentRoom.height}m (H)
                            </div>

                            {isDimensionsOpen && (
                                <div className="space-y-2 pt-2 border-t border-slate-700/80 text-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400">Width (m):</span>
                                        <input
                                            type="number"
                                            step="0.5"
                                            min="2"
                                            max="25"
                                            value={currentRoom.width}
                                            onChange={(e) => setRoomDimensions(parseFloat(e.target.value) || 6, currentRoom.length, currentRoom.height)}
                                            className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-right text-white font-bold"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400">Length (m):</span>
                                        <input
                                            type="number"
                                            step="0.5"
                                            min="2"
                                            max="25"
                                            value={currentRoom.length}
                                            onChange={(e) => setRoomDimensions(currentRoom.width, parseFloat(e.target.value) || 5, currentRoom.height)}
                                            className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-right text-white font-bold"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-400">Height (m):</span>
                                        <input
                                            type="number"
                                            step="0.2"
                                            min="2"
                                            max="6"
                                            value={currentRoom.height}
                                            onChange={(e) => setRoomDimensions(currentRoom.width, currentRoom.length, parseFloat(e.target.value) || 2.8)}
                                            className="w-20 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-right text-white font-bold"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* AI & Scanning & OBJ Upload Shortcuts */}
                        <div className="space-y-2">
                            <button
                                onClick={() => setAiModalOpen(true)}
                                className="w-full p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center space-x-2 active:scale-95 cursor-pointer"
                            >
                                <span>✨ Furnish with AI</span>
                            </button>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setScanModalOpen(true)}
                                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] border border-slate-700 transition-all flex items-center justify-center space-x-1 cursor-pointer"
                                >
                                    <span>📷 Scan Room</span>
                                </button>
                                <label className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-[#FFDB00] font-bold text-[11px] border border-amber-500/30 transition-all flex items-center justify-center space-x-1 cursor-pointer">
                                    <span>📦 Upload .OBJ</span>
                                    <input
                                        type="file"
                                        accept=".obj"
                                        className="hidden"
                                        onChange={handleFileUpload}
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Furniture Catalog Palette */}
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FFDB00]">
                                    2. Add Furniture
                                </span>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setCategory(e.target.value as any)}
                                    className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-1 rounded-md border border-slate-700 focus:outline-none"
                                >
                                    <option value="All">All Items</option>
                                    <option value="Chairs">Chairs</option>
                                    <option value="Desks">Desks</option>
                                    <option value="Tables">Tables</option>
                                    <option value="Sofas">Sofas</option>
                                    <option value="Storage">Storage</option>
                                </select>
                            </div>

                            <div className="space-y-2 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
                                {filteredCatalog.map((item) => (
                                    <div
                                        key={item.id}
                                        className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 hover:border-[#0058A3] transition-all flex items-center justify-between group"
                                    >
                                        <div className="truncate pr-2">
                                            <span className="font-bold text-xs text-white block truncate">{item.name}</span>
                                            <span className="text-[10px] text-slate-400 font-mono">
                                                ₹{item.price} • {item.width}×{item.depth}m
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                addObject({
                                                    productId: item.id,
                                                    type: "furniture",
                                                    name: item.name,
                                                    position: [0, 0, 0],
                                                    rotation: [0, 0, 0],
                                                    width: item.width,
                                                    depth: item.depth,
                                                    height: item.height,
                                                    color: item.color,
                                                    modelUrl: item.modelUrl,
                                                    price: item.price,
                                                    condition: item.condition
                                                });
                                                showToast(`Added "${item.name}"`);
                                            }}
                                            className="px-2.5 py-1 rounded-lg bg-[#0058A3] hover:bg-blue-600 text-white font-bold text-[10px] shadow-sm transition-all whitespace-nowrap active:scale-95"
                                        >
                                            + Add
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Real-Time Cost Summary */}
                    <div className="pt-4 border-t border-slate-800 space-y-2 bg-slate-900">
                        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                            <span>Furniture Items:</span>
                            <span className="text-white font-bold">{currentRoom.objects.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase text-slate-400">Total Subtotal:</span>
                            <span className="text-xl font-extrabold text-[#FFDB00]">
                                ₹{totalCost.toLocaleString("en-IN")}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-2">
                            <button
                                onClick={clearRoom}
                                className="py-1.5 rounded-xl bg-slate-800 hover:bg-red-950 hover:text-red-400 text-slate-400 text-xs font-bold transition-colors"
                            >
                                Clear All
                            </button>
                            <button
                                onClick={() => setArModalOpen(true)}
                                className="py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                            >
                                AR Preview
                            </button>
                        </div>
                    </div>
                </aside>

                {/* CENTER 3D CANVAS & HUD CONTROLS */}
                <div className="flex-1 relative bg-slate-950 flex flex-col">
                    {/* Floating HUD Header Controls */}
                    <RoomPlannerControls />

                    {/* 3D Room Canvas */}
                    <div className="w-full h-full">
                        <RoomScene />
                    </div>

                    {/* Floating View Mode Switcher */}
                    <div className="absolute bottom-6 left-6 z-20 backdrop-blur-md bg-white/70 border border-white/60 p-1 rounded-2xl shadow-lg flex items-center space-x-1">
                        <button
                            onClick={() => setViewMode("3D")}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${viewMode === "3D" ? "bg-[#0058A3] text-white shadow-sm" : "text-slate-800 hover:bg-white/60"}`}
                        >
                            3D Orbit
                        </button>
                        <button
                            onClick={() => setViewMode("2D")}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${viewMode === "2D" ? "bg-[#0058A3] text-white shadow-sm" : "text-slate-800 hover:bg-white/60"}`}
                        >
                            2D Topdown
                        </button>
                    </div>
                </div>

                {/* RIGHT INSPECTOR SIDEBAR */}
                <InspectorSidebar />
            </div>

            {/* Action Modals */}
            <AIFurnishModal />
            <ScanRoomModal />
        </div>
    );
};
