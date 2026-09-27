import React, { useRef, useState } from "react";
import { useRoomStore } from "../../store/roomStore";
import { useUIStore, type MeasurementUnit } from "../../store/uiStore";

export const RoomPlannerControls: React.FC = () => {
    const currentRoom = useRoomStore((state) => state.currentRoom);
    const undo = useRoomStore((state) => state.undo);
    const redo = useRoomStore((state) => state.redo);
    const historyIndex = useRoomStore((state) => state.historyIndex);
    const history = useRoomStore((state) => state.history);

    const sizeMode = useUIStore((state) => state.sizeMode);
    const setSizeMode = useUIStore((state) => state.setSizeMode);
    const depthMapActive = useUIStore((state) => state.depthMapActive);
    const toggleDepthMap = useUIStore((state) => state.toggleDepthMap);
    const unit = useUIStore((state) => state.unit);
    const setUnit = useUIStore((state) => state.setUnit);
    const showToast = useUIStore((state) => state.showToast);

    const [isUnitDropdownOpen, setIsUnitDropdownOpen] = useState(false);
    const [isOneToOneActive, setIsOneToOneActive] = useState(true);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const roomArea = (currentRoom.width * currentRoom.length).toFixed(1);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            showToast(`Room photo "${file.name}" uploaded as 3D backdrop!`);
        }
    };

    const handleSaveLayout = () => {
        showToast("Room layout saved to your profile ✓");
    };

    const handleConfirmPlacement = () => {
        showToast("Placement confirmed! Furniture reserved in 3D scene.");
    };

    return (
        <div className="absolute top-0 inset-x-0 z-20 p-6 flex flex-col md:flex-row items-center justify-between gap-4 pointer-events-none">
            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
            />

            {/* LEFT GROUP */}
            <div className="flex flex-col gap-2.5 pointer-events-auto items-start">
                {/* Top Row: Room Area & Depth Pill */}
                <div className="flex items-center space-x-3 backdrop-blur-md bg-white/70 border border-white/60 shadow-sm rounded-2xl p-1.5 px-3 text-slate-800 font-medium text-sm hover:bg-white/85 transition-all">
                    {/* Left section: Room Area */}
                    <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-[#0058A3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span className="font-semibold text-xs text-slate-800 tracking-tight">ROOM AREA: {roomArea} sq m</span>
                    </div>

                    {/* Divider */}
                    <div className="h-4 w-px bg-slate-300/80"></div>

                    {/* Right section: Depth map toggle */}
                    <button
                        onClick={toggleDepthMap}
                        className={`flex items-center space-x-1.5 px-2 py-1 rounded-xl text-xs transition-all ${depthMapActive ? "bg-[#0058A3] text-white font-semibold shadow-sm" : "hover:bg-slate-200/60 text-slate-700"}`}
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <span>Depth map</span>
                    </button>

                    {/* Divider */}
                    <div className="h-4 w-px bg-slate-300/80"></div>

                    {/* File Upload Trigger */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-[#FFDB00]/90 hover:bg-[#FFDB00] text-slate-900 transition-all shadow-sm"
                        title="Upload room photo backdrop"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span>Upload Room Photo</span>
                    </button>
                </div>

                {/* Bottom Row: Save Layout Button */}
                <button
                    onClick={handleSaveLayout}
                    className="flex items-center space-x-2 backdrop-blur-md bg-white/70 border border-white/60 shadow-sm rounded-full px-4 py-1.5 text-slate-800 font-medium text-xs hover:bg-white hover:scale-105 active:scale-95 transition-all"
                >
                    <svg className="w-3.5 h-3.5 text-[#0058A3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    <span className="font-semibold text-slate-800">Save Layout</span>
                </button>
            </div>

            {/* CENTER GROUP */}
            <div className="flex flex-col items-center gap-2 pointer-events-auto">
                {/* Top Row: Size / Mode Segmented Pill */}
                <div className="backdrop-blur-md bg-white/70 border border-white/60 shadow-sm rounded-2xl p-1 flex items-center space-x-1">
                    <button
                        onClick={() => setSizeMode("L")}
                        className={`transition-all ${sizeMode === "L"
                                ? "bg-[#0058A3] text-white rounded-xl px-4 py-1.5 font-semibold text-xs shadow-sm"
                                : "plain text text-slate-700 font-medium text-xs hover:text-[#0058A3] px-4 py-1.5"
                            }`}
                    >
                        L
                    </button>
                    <button
                        onClick={() => setSizeMode("M")}
                        className={`transition-all ${sizeMode === "M"
                                ? "bg-[#0058A3] text-white rounded-xl px-4 py-1.5 font-semibold text-xs shadow-sm"
                                : "plain text text-slate-700 font-medium text-xs hover:text-[#0058A3] px-4 py-1.5"
                            }`}
                    >
                        M
                    </button>
                </div>

                {/* Bottom Row: History Controls */}
                <div className="backdrop-blur-md bg-white/70 border border-white/60 shadow-sm rounded-full px-3 py-1 flex items-center space-x-2 text-xs font-medium text-slate-800">
                    <button
                        onClick={undo}
                        disabled={historyIndex <= 0}
                        className="flex items-center space-x-1 hover:text-[#0058A3] px-2 py-0.5 rounded-md hover:bg-slate-200/50 transition-all active:scale-95 disabled:opacity-40"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        <span>Undo</span>
                    </button>

                    <div className="h-3.5 w-px bg-slate-300"></div>

                    <button
                        onClick={redo}
                        disabled={historyIndex >= history.length - 1}
                        className="flex items-center space-x-1 hover:text-[#0058A3] px-2 py-0.5 rounded-md hover:bg-slate-200/50 transition-all active:scale-95 disabled:opacity-40"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
                        </svg>
                        <span>Redo</span>
                    </button>
                </div>
            </div>

            {/* RIGHT GROUP */}
            <div className="flex flex-wrap items-center justify-end gap-3 pointer-events-auto">
                {/* 1:1 Scale Pill Button */}
                <button
                    onClick={() => setIsOneToOneActive(!isOneToOneActive)}
                    className={`flex items-center space-x-2 backdrop-blur-md border shadow-sm rounded-2xl px-3.5 py-2 text-xs font-semibold transition-all ${isOneToOneActive
                            ? "bg-white/90 border-[#0058A3] text-[#0058A3]"
                            : "bg-white/70 border-white/60 text-slate-800 hover:bg-white"
                        }`}
                >
                    <svg className="w-4 h-4 text-[#0058A3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    <span>1:1 Scale</span>
                </button>

                {/* Measurement Units Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsUnitDropdownOpen(!isUnitDropdownOpen)}
                        className="flex items-center space-x-2 backdrop-blur-md bg-white/70 border border-white/60 shadow-sm rounded-2xl px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-white transition-all"
                    >
                        <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span>Units: {unit}</span>
                        <svg className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isUnitDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {isUnitDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-40 backdrop-blur-xl bg-white/95 border border-slate-200 rounded-2xl shadow-xl py-1 z-30 text-xs">
                            {(["Meters", "Centimeters", "Feet", "Inches"] as MeasurementUnit[]).map((u) => (
                                <button
                                    key={u}
                                    onClick={() => {
                                        setUnit(u);
                                        setIsUnitDropdownOpen(false);
                                        showToast(`Measurement units set to ${u}`);
                                    }}
                                    className={`w-full text-left px-4 py-2 hover:bg-[#0058A3] hover:text-white transition-colors flex items-center justify-between ${unit === u ? "font-bold text-[#0058A3]" : "text-slate-700"}`}
                                >
                                    <span>{u}</span>
                                    {unit === u && <span>✓</span>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Confirm Placement Primary CTA */}
                <button
                    onClick={handleConfirmPlacement}
                    className="bg-[#FFDB00] hover:bg-[#ebd000] text-black font-semibold rounded-2xl px-5 py-2.5 shadow-sm text-xs flex items-center space-x-2 active:scale-95 transition-all cursor-pointer"
                >
                    <svg className="w-4 h-4 text-black stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-bold">Confirm Placement</span>
                </button>
            </div>
        </div>
    );
};
