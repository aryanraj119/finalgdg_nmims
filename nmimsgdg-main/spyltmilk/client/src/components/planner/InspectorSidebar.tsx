import React from "react";
import { useRoomStore } from "../../store/roomStore";
import { useFurnitureStore } from "../../store/furnitureStore";
import { useUIStore } from "../../store/uiStore";

export const InspectorSidebar: React.FC = () => {
    const selectedObjectId = useRoomStore((state) => state.selectedObjectId);
    const currentRoom = useRoomStore((state) => state.currentRoom);
    const updateObject = useRoomStore((state) => state.updateObject);
    const duplicateObject = useRoomStore((state) => state.duplicateObject);
    const deleteObject = useRoomStore((state) => state.deleteObject);

    const catalog = useFurnitureStore((state) => state.catalog);
    const addToCart = useFurnitureStore((state) => state.addToCart);
    const showToast = useUIStore((state) => state.showToast);

    const selectedObject = currentRoom.objects.find((o) => o.id === selectedObjectId);
    const furnitureMeta = catalog.find((f) => f.id === selectedObject?.productId);

    if (!selectedObject) {
        return (
            <div className="w-80 bg-white border-l border-slate-200 p-6 flex flex-col items-center justify-center text-center text-slate-400 h-full">
                <div className="p-4 rounded-full bg-slate-100 mb-3">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                </div>
                <h4 className="font-bold text-slate-700 text-sm">No Object Selected</h4>
                <p className="text-xs text-slate-500 mt-1">
                    Click on any furniture in the 3D room to edit its position, rotation, dimensions, or details.
                </p>
            </div>
        );
    }

    const rotDeg = Math.round(((selectedObject.rotation[1] || 0) * 180) / Math.PI);

    return (
        <aside className="w-80 bg-white border-l border-slate-200 p-6 flex flex-col justify-between overflow-y-auto h-full text-slate-900 shadow-lg z-10">
            <div className="space-y-6">
                {/* Header */}
                <div className="border-b border-slate-100 pb-4">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0058A3] bg-blue-50 px-2.5 py-1 rounded-md">
                        {selectedObject.type} INSPECTOR
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-2 leading-snug">
                        {selectedObject.name}
                    </h3>
                    {selectedObject.condition && (
                        <span className="inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {selectedObject.condition}
                        </span>
                    )}
                </div>

                {/* Price Display */}
                {selectedObject.price && (
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase">Item Price</span>
                        <span className="text-2xl font-extrabold text-slate-900">₹{selectedObject.price.toLocaleString("en-IN")}</span>
                    </div>
                )}

                {/* Dimensions */}
                <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Real-World Dimensions</h4>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Width</span>
                            <span className="font-extrabold text-slate-800">{selectedObject.width || 0.6}m</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Depth</span>
                            <span className="font-extrabold text-slate-800">{selectedObject.depth || 0.6}m</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Height</span>
                            <span className="font-extrabold text-slate-800">{selectedObject.height || 0.8}m</span>
                        </div>
                    </div>
                </div>

                {/* Position & Rotation Numeric Editors */}
                <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Position & Orientation</h4>

                    {/* Position X */}
                    <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-600">Position X (m):</span>
                        <input
                            type="number"
                            step="0.1"
                            value={selectedObject.position[0].toFixed(2)}
                            onChange={(e) =>
                                updateObject(selectedObject.id, {
                                    position: [parseFloat(e.target.value) || 0, selectedObject.position[1], selectedObject.position[2]]
                                })
                            }
                            className="w-24 px-2 py-1 bg-slate-50 border border-slate-300 rounded-lg text-right font-mono font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0058A3]"
                        />
                    </div>

                    {/* Position Z */}
                    <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-600">Position Z (m):</span>
                        <input
                            type="number"
                            step="0.1"
                            value={selectedObject.position[2].toFixed(2)}
                            onChange={(e) =>
                                updateObject(selectedObject.id, {
                                    position: [selectedObject.position[0], selectedObject.position[1], parseFloat(e.target.value) || 0]
                                })
                            }
                            className="w-24 px-2 py-1 bg-slate-50 border border-slate-300 rounded-lg text-right font-mono font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0058A3]"
                        />
                    </div>

                    {/* Rotation Y */}
                    <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-600">Rotation Y (°):</span>
                        <input
                            type="number"
                            step="15"
                            value={rotDeg}
                            onChange={(e) => {
                                const rad = ((parseFloat(e.target.value) || 0) * Math.PI) / 180;
                                updateObject(selectedObject.id, {
                                    rotation: [selectedObject.rotation[0], rad, selectedObject.rotation[2]]
                                });
                            }}
                            className="w-24 px-2 py-1 bg-slate-50 border border-slate-300 rounded-lg text-right font-mono font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0058A3]"
                        />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-6 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => duplicateObject(selectedObject.id)}
                        className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all"
                    >
                        Duplicate
                    </button>
                    <button
                        onClick={() => deleteObject(selectedObject.id)}
                        className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition-all"
                    >
                        Delete
                    </button>
                </div>

                {furnitureMeta && (
                    <button
                        onClick={() => {
                            addToCart(furnitureMeta);
                            showToast(`Added "${furnitureMeta.name}" to Cart`);
                        }}
                        className="w-full py-2.5 bg-[#0058A3] hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center space-x-1.5"
                    >
                        <span>Add to Cart</span>
                    </button>
                )}
            </div>
        </aside>
    );
};
