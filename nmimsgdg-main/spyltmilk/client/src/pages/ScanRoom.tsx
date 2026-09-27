import React, { useState } from "react";
import { Navbar } from "../components/ui/Navbar";
import { useNavigate } from "react-router-dom";
import { VGGTReconstructionProvider } from "../services/reconstructionService";
import { useRoomStore } from "../store/roomStore";
import { useUIStore } from "../store/uiStore";

export const ScanRoom: React.FC = () => {
    const navigate = useNavigate();
    const loadDemoClassroom = useRoomStore((state) => state.loadDemoClassroom);
    const showToast = useUIStore((state) => state.showToast);

    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const urls = files.map((f) => URL.createObjectURL(f));
            setUploadedImages([...uploadedImages, ...urls]);
        }
    };

    const handleStartReconstruction = async () => {
        if (uploadedImages.length === 0) return;

        setIsProcessing(true);
        setProgress(25);

        try {
            const provider = new VGGTReconstructionProvider();
            setTimeout(() => setProgress(65), 1000);
            setTimeout(() => setProgress(90), 2000);

            const result = await provider.reconstruct(uploadedImages);
            setProgress(100);

            showToast(`🎉 ${result.message}`);
            loadDemoClassroom();
            navigate("/secondhand.html");
        } catch (error) {
            console.error(error);
            showToast("Failed to process VGGT 3D reconstruction");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="text-center space-y-3 mb-10">
                    <span className="text-xs font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                        VGGT Photo-to-3D Reconstruction
                    </span>
                    <h1 className="text-4xl font-extrabold text-slate-900">Scan Your Real Room</h1>
                    <p className="text-slate-600 text-sm max-w-lg mx-auto">
                        Upload 5–10 photographs of your room from different angles. Our VGGT pipeline will reconstruct a 1:1 scale 3D digital twin.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
                    {/* Drag and drop upload zone */}
                    <div className="border-2 border-dashed border-slate-300 hover:border-[#0058A3] rounded-2xl p-10 text-center bg-slate-50 hover:bg-blue-50/50 transition-all cursor-pointer relative">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <div className="inline-flex p-4 rounded-full bg-white shadow-md border border-slate-200 mb-3">
                            <svg className="w-8 h-8 text-[#0058A3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-slate-900 text-base">Drag & Drop Room Photographs</h3>
                        <p className="text-xs text-slate-500 mt-1">Recommended: Wide angle, overlap shots with good lighting</p>
                    </div>

                    {/* Uploaded Grid */}
                    {uploadedImages.length > 0 && (
                        <div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
                                Uploaded Viewpoints ({uploadedImages.length}):
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {uploadedImages.map((src, idx) => (
                                    <div key={idx} className="h-28 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative group">
                                        <img src={src} alt="Room scan" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Progress indicator */}
                    {isProcessing && (
                        <div className="space-y-2 pt-2">
                            <div className="flex justify-between text-xs font-bold text-slate-700">
                                <span>VGGT Camera Poses & Depth Reconstruction...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                <div className="bg-purple-600 h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                    )}

                    {/* CTA */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <button
                            onClick={() => navigate("/secondhand.html")}
                            className="text-xs font-bold text-slate-500 hover:text-slate-900"
                        >
                            ← Skip to 3D Planner
                        </button>
                        <button
                            onClick={handleStartReconstruction}
                            disabled={isProcessing || uploadedImages.length === 0}
                            className="px-8 py-3 rounded-full bg-[#0058A3] hover:bg-blue-800 text-white font-bold text-xs shadow-lg transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isProcessing ? "Reconstructing Room..." : "Reconstruct 3D Digital Twin"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
