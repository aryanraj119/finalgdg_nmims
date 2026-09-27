import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "../components/ui/Navbar";
import { useFurnitureStore } from "../store/furnitureStore";
import { useRoomStore } from "../store/roomStore";
import { useUIStore } from "../store/uiStore";

export const ProductDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const catalog = useFurnitureStore((state) => state.catalog);
    const addToCart = useFurnitureStore((state) => state.addToCart);
    const addObject = useRoomStore((state) => state.addObject);
    const showToast = useUIStore((state) => state.showToast);

    const product = catalog.find((p) => p.id === id) || catalog[0];

    const handleAddToRoom = () => {
        addObject({
            productId: product.id,
            type: "furniture",
            name: product.name,
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            width: product.width,
            depth: product.depth,
            height: product.height,
            color: product.color,
            price: product.price,
            condition: product.condition
        });
        showToast(`Added "${product.name}" to 3D Room`);
        navigate("/secondhand.html");
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                    {/* Visual */}
                    <div
                        className="h-96 rounded-2xl flex items-center justify-center p-8 border border-slate-200"
                        style={{ backgroundColor: product.color ? `${product.color}15` : "#F1F5F9" }}
                    >
                        <div
                            className="w-40 h-40 rounded-3xl shadow-xl flex items-center justify-center border-4 border-white"
                            style={{ backgroundColor: product.color || "#64748B" }}
                        >
                            <span className="text-white text-base font-black uppercase text-center">
                                {product.category}
                            </span>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex flex-col justify-between space-y-6">
                        <div className="space-y-3">
                            <span className="text-xs font-bold text-[#0058A3] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                                {product.category} • {product.condition}
                            </span>
                            <h1 className="text-3xl font-extrabold text-slate-900">{product.name}</h1>
                            <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>

                            <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-3 text-center text-xs">
                                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/60">
                                    <span className="text-slate-400 block font-bold uppercase text-[10px]">Width</span>
                                    <span className="font-extrabold text-slate-800 text-sm">{product.width}m</span>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/60">
                                    <span className="text-slate-400 block font-bold uppercase text-[10px]">Depth</span>
                                    <span className="font-extrabold text-slate-800 text-sm">{product.depth}m</span>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/60">
                                    <span className="text-slate-400 block font-bold uppercase text-[10px]">Height</span>
                                    <span className="font-extrabold text-slate-800 text-sm">{product.height}m</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 space-y-4">
                            <div className="flex items-baseline justify-between">
                                <span className="text-3xl font-black text-slate-900">₹{product.price.toLocaleString("en-IN")}</span>
                                {product.originalPrice && (
                                    <span className="text-sm text-slate-400 line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={handleAddToRoom}
                                    className="py-3.5 bg-[#0058A3] hover:bg-blue-800 text-white font-bold rounded-2xl text-xs shadow-md transition-all active:scale-95"
                                >
                                    + Add to 3D Room Planner
                                </button>
                                <button
                                    onClick={() => {
                                        addToCart(product);
                                        showToast(`Added "${product.name}" to Cart`);
                                    }}
                                    className="py-3.5 bg-[#FFDB00] hover:bg-[#ebd000] text-black font-bold rounded-2xl text-xs shadow-md transition-all active:scale-95"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
