import React, { useState } from "react";
import { useUIStore } from "../../store/uiStore";
import { useRoomStore } from "../../store/roomStore";
import { VGGTReconstructionProvider } from "../../services/reconstructionService";

export const ScanRoomModal: React.FC = () => {
    const isScanModalOpen = useUIStore((state) => state.isScanModalOpen);
    const setScanModalOpen = useUIStore((state) => state.setScanModalOpen);
    const showToast = useUIStore((state) => state.showToast);
    const loadDemoClassroom = useRoomStore((state) => state.loadDemoClassroom);

    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const [progress, setProgress] = useState(0);

    if (!isScanModalOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const urls = files.map((f) => URL.createObjectURL(f));
            setUploadedImages([...uploadedImages, ...urls]);
        }
    };

    const handleStartReconstruction = async () => {
        if (uploadedImages.length === 0) return;

        setIsScanning(true);
        setProgress(25);

        try {
            const provider = new VGGTReconstructionProvider();

            setTimeout(() => setProgress(65), 800);
            setTimeout(() => setProgress(90), 1500);

            const result = await provider.reconstruct(uploadedImages);

            setProgress(100);
            showToast(`🎉 ${result.message}`);
            setScanModalOpen(false);

            // Load reconstructed room into planner
            if (result.roomState) {
                loadDemoClassroom();
            }
        } catch (error) {
            console.error("VGGT error:", error);
            showToast("Failed to process VGGT 3D room reconstruction.");
        } finally {
            setIsScanning(false);
            setProgress(0);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                    <div className="flex items-center space-x-2">
                        <span className="p-2 rounded-xl bg-purple-600 text-white font-black text-xs">
                            3D
                        </span>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 leading-none">📷 Scan Your Room (VGGT)</h3>
                            <p className="text-xs text-slate-500 mt-1">Photo-to-3D Reconstruction Pipeline</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setScanModalOpen(false)}
                        className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-5">
                    {/* Drag & Drop Photo Upload Box */}
                    <div className="border-2 border-dashed border-slate-300 hover:border-[#0058A3] rounded-2xl p-6 text-center bg-slate-50 hover:bg-blue-50/50 transition-all cursor-pointer relative">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <div className="inline-flex p-3 rounded-full bg-white shadow-sm border border-slate-200 mb-2">
                            <svg className="w-6 h-6 text-[#0058A3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h0.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm">Drag room photos here or click to browse</h4>
                        <p className="text-xs text-slate-500 mt-1">Recommended: 5–10 photos from varied angles</p>
                    </div>

                    {/* Uploaded Thumbnails */}
                    {uploadedImages.length > 0 && (
                        <div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                                Uploaded Photos ({uploadedImages.length}):
                            </span>
                            <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto">
                                {uploadedImages.map((src, idx) => (
                                    <div key={idx} className="relative h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                                        <img src={src} alt="Room upload" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Progress Bar */}
                    {isScanning && (
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-bold text-slate-700">
                                <span>VGGT Reconstruction & Mesh Extraction...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div className="bg-[#0058A3] h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                        <button
                            onClick={() => setScanModalOpen(false)}
                            className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleStartReconstruction}
                            disabled={isScanning || uploadedImages.length === 0}
                            className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#0058A3] hover:bg-blue-800 text-white shadow-md transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isScanning ? "Processing VGGT..." : "Start 3D Reconstruction"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
