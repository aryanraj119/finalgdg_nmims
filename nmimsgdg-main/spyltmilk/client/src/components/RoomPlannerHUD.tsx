import React, { useState, useRef } from "react";

interface RoomPlannerHUDProps {
    onSaveLayout?: () => void;
    onConfirmPlacement?: () => void;
}

const RoomPlannerHUD: React.FC<RoomPlannerHUDProps> = ({ onSaveLayout, onConfirmPlacement }) => {
    // States
    const [sizeMode, setSizeMode] = useState<"L" | "M">("L");
    const [depthMapActive, setDepthMapActive] = useState<boolean>(false);
    const [unit, setUnit] = useState<string>("Meters");
    const [isUnitDropdownOpen, setIsUnitDropdownOpen] = useState<boolean>(false);
    const [isOneToOneActive, setIsOneToOneActive] = useState<boolean>(true);
    const [roomImage, setRoomImage] = useState<string | null>(null);
    const [history, setHistory] = useState<string[]>(["Initial Room Loaded"]);
    const [historyIndex, setHistoryIndex] = useState<number>(0);
    const [notification, setNotification] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const showNotification = (msg: string) => {
        setNotification(msg);
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setRoomImage(url);
            showNotification(`Room photo "${file.name}" uploaded as 3D backdrop!`);
            setHistory([...history.slice(0, historyIndex + 1), `Uploaded ${file.name}`]);
            setHistoryIndex(historyIndex + 1);
        }
    };

    const handleUndo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            showNotification(`Undo: ${history[historyIndex - 1]}`);
        } else {
            showNotification("No previous action to undo.");
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            showNotification(`Redo: ${history[historyIndex + 1]}`);
        } else {
            showNotification("Already at latest state.");
        }
    };

    const handleSave = () => {
        if (onSaveLayout) onSaveLayout();
        showNotification("Layout saved to your IKEA profile ✓");
    };

    const handleConfirm = () => {
        if (onConfirmPlacement) onConfirmPlacement();
        showNotification("Placement confirmed! Furniture reserved in 3D scene.");
    };

    return (
        <div className="relative w-full overflow-hidden rounded-3xl bg-slate-900 border border-slate-700/60 shadow-2xl mb-12">
            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
            />

            {/* Notification Toast */}
            {notification && (
                <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 bg-[#0058A3] text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-xl animate-bounce flex items-center space-x-2 border border-blue-400/30">
                    <span className="bg-[#FFDB00] text-black w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black">i</span>
                    <span>{notification}</span>
                </div>
            )}

            {/* 3D Scene Viewport / Canvas Backdrop */}
            <div className="relative w-full h-[540px] bg-slate-950 flex items-center justify-center overflow-hidden">
                {roomImage ? (
                    <img
                        src={roomImage}
                        alt="Uploaded Room Photo"
                        className={`w-full h-full object-cover transition-all duration-500 ${depthMapActive ? "contrast-125 brightness-90 hue-rotate-30" : ""}`}
                    />
                ) : (
                    <div className="relative w-full h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center">
                        {/* Interactive 3D Room Mockup Grid & Perspective lines */}
                        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>

                        {/* Room Perspective Wireframe Graphic */}
                        <div className="relative w-[80%] h-[75%] border-2 border-dashed border-blue-400/40 rounded-2xl flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
                            <div className="text-center space-y-3 p-6">
                                <div className="inline-flex p-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                                    <svg className="w-10 h-10 text-[#FFDB00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <h3 className="text-white font-bold text-xl">3D Room Perspective Canvas</h3>
                                <p className="text-slate-400 text-sm max-w-md mx-auto">
                                    Upload your room photo using the HUD header above or arrange pre-loved IKEA furniture in 1:1 scale perspective.
                                </p>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-semibold border border-white/20 transition-all shadow-md inline-flex items-center space-x-2"
                                >
                                    <svg className="w-4 h-4 text-[#FFDB00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>Upload Room Backdrop</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Depth Map Grid Visualizer Overlay */}
                {depthMapActive && (
                    <div className="absolute inset-0 bg-indigo-900/30 backdrop-hue-rotate-60 pointer-events-none flex items-center justify-center">
                        <div className="w-full h-full bg-[linear-gradient(to_right,#818cf815_1px,transparent_1px),linear-gradient(to_bottom,#818cf815_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                        <span className="absolute bottom-6 right-6 bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                            Depth Map Analysis Active
                        </span>
                    </div>
                )}
            </div>

            {/* TOP NAVIGATION BAR & FLOATING HUD HEADER */}
            <div className="absolute top-0 inset-x-0 z-20 p-6 flex flex-col md:flex-row items-center justify-between gap-4 pointer-events-none">

                {/* LEFT GROUP */}
                <div className="flex flex-col gap-2.5 pointer-events-auto items-start">
                    {/* Top Row: Room Area & Depth Pill */}
                    <div className="flex items-center space-x-3 backdrop-blur-md bg-white/70 border border-white/60 shadow-sm rounded-2xl p-1.5 px-3 text-slate-800 font-medium text-sm hover:bg-white/85 transition-all">
                        {/* Left section: Room Area */}
                        <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-[#0058A3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span className="font-semibold text-xs text-slate-800 tracking-tight">ROOM AREA: 24.5 sq m</span>
                        </div>

                        {/* Divider */}
                        <div className="h-4 w-px bg-slate-300/80"></div>

                        {/* Right section: Depth map toggle */}
                        <button
                            onClick={() => setDepthMapActive(!depthMapActive)}
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
                            title="Upload custom room photo backdrop"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <span>Upload Room Photo</span>
                        </button>
                    </div>

                    {/* Bottom Row: Save Layout Button */}
                    <button
                        onClick={handleSave}
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
                            onClick={handleUndo}
                            className="flex items-center space-x-1 hover:text-[#0058A3] px-2 py-0.5 rounded-md hover:bg-slate-200/50 transition-all active:scale-95"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                            <span>Undo</span>
                        </button>

                        <div className="h-3.5 w-px bg-slate-300"></div>

                        <button
                            onClick={handleRedo}
                            className="flex items-center space-x-1 hover:text-[#0058A3] px-2 py-0.5 rounded-md hover:bg-slate-200/50 transition-all active:scale-95"
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
                                {["Meters", "Centimeters", "Feet", "Inches"].map((u) => (
                                    <button
                                        key={u}
                                        onClick={() => {
                                            setUnit(u);
                                            setIsUnitDropdownOpen(false);
                                            showNotification(`Unit changed to ${u}`);
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
                        onClick={handleConfirm}
                        className="bg-[#FFDB00] hover:bg-[#ebd000] text-black font-semibold rounded-2xl px-5 py-2.5 shadow-sm text-xs flex items-center space-x-2 active:scale-95 transition-all cursor-pointer"
                    >
                        <svg className="w-4 h-4 text-black stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-bold">Confirm Placement</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomPlannerHUD;
