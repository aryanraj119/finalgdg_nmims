import React, { useState } from "react";
import { useUIStore } from "../../store/uiStore";
import { useRoomStore } from "../../store/roomStore";
import { useFurnitureStore } from "../../store/furnitureStore";
import { NemotronRoomAI } from "../../services/aiService";

export const AIFurnishModal: React.FC = () => {
    const isAiModalOpen = useUIStore((state) => state.isAiModalOpen);
    const setAiModalOpen = useUIStore((state) => state.setAiModalOpen);
    const showToast = useUIStore((state) => state.showToast);

    const currentRoom = useRoomStore((state) => state.currentRoom);
    const addObject = useRoomStore((state) => state.addObject);
    const clearRoom = useRoomStore((state) => state.clearRoom);

    const catalog = useFurnitureStore((state) => state.catalog);

    const [promptText, setPromptText] = useState("");
    const [isThinking, setIsThinking] = useState(false);

    if (!isAiModalOpen) return null;

    const handleGenerate = async (presetPrompt?: string) => {
        const textToUse = presetPrompt || promptText;
        if (!textToUse.trim()) return;

        setIsThinking(true);

        try {
            // Use Nemotron if available, falls back to MockRoomAI
            const ai = new NemotronRoomAI();
            const response = await ai.generateLayout(textToUse, currentRoom, catalog);

            // Clear current room objects & apply generated actions
            clearRoom();

            for (const action of response.actions) {
                if (action.type === "add") {
                    const item = catalog.find((f) => f.id === action.productId);
                    if (item) {
                        addObject({
                            productId: item.id,
                            type: "furniture",
                            name: item.name,
                            position: action.position || [0, 0, 0],
                            rotation: [0, action.rotationY || 0, 0],
                            width: item.width,
                            depth: item.depth,
                            height: item.height,
                            color: item.color,
                            price: item.price,
                            condition: item.condition
                        });
                    }
                }
            }

            showToast(`✨ AI Furnished ${response.itemCount} items! Subtotal: ₹${response.estimatedCost.toLocaleString("en-IN")}`);
            setAiModalOpen(false);
            setPromptText("");
        } catch (error) {
            console.error("AI Generation error:", error);
            showToast("Failed to generate AI layout.");
        } finally {
            setIsThinking(false);
        }
    };

    const presetPrompts = [
        "Furnish this classroom for 30 students under ₹40,000 with comfortable walking space.",
        "Arrange an executive office setup with standing desk and storage under ₹20,000.",
        "Create a cozy Scandinavian living room with 3-seater sofa and accent chair."
    ];

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                    <div className="flex items-center space-x-2">
                        <span className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs">
                            AI
                        </span>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 leading-none">✨ Furnish with AI</h3>
                            <p className="text-xs text-slate-500 mt-1">Nemotron LLM Reasoning & Spatial Action Executor</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setAiModalOpen(false)}
                        className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                            What do you want to create?
                        </label>
                        <textarea
                            value={promptText}
                            onChange={(e) => setPromptText(e.target.value)}
                            placeholder='e.g., "Furnish this classroom for 30 students under ₹40,000 with comfortable walking space."'
                            rows={3}
                            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0058A3]"
                        />
                    </div>

                    {/* Quick Presets */}
                    <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                            Quick Demo Presets:
                        </span>
                        <div className="space-y-1.5">
                            {presetPrompts.map((preset, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleGenerate(preset)}
                                    className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200/60 text-xs text-slate-700 font-medium transition-all flex items-center justify-between group"
                                >
                                    <span className="group-hover:text-[#0058A3]">"{preset}"</span>
                                    <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-400 font-bold group-hover:bg-[#0058A3] group-hover:text-white">
                                        Run →
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                        <button
                            onClick={() => setAiModalOpen(false)}
                            className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => handleGenerate()}
                            disabled={isThinking || !promptText.trim()}
                            className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#0058A3] hover:bg-blue-800 text-white shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center space-x-2"
                        >
                            {isThinking ? (
                                <>
                                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    <span>Reasoning Layout...</span>
                                </>
                            ) : (
                                <span>✨ Generate AI Layout</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
