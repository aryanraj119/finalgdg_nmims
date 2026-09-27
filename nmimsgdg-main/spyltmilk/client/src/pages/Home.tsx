import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/ui/Navbar";

export const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans selection:bg-[#FFDB00] selection:text-black">
            <Navbar />

            {/* HERO SECTION */}
            <section className="relative overflow-hidden pt-12 pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-slate-50 to-[#F9FAFB]">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Copy */}
                    <div className="space-y-6">
                        <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200/80 text-[#0058A3] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                            <span>🌱 Circular Furniture Economy</span>
                            <span>•</span>
                            <span>AI 3D Spatial Planner</span>
                        </div>
                        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight text-slate-900">
                            Give furniture a <span className="text-[#0058A3] underline decoration-[#FFDB00] underline-offset-8">second life</span>.
                        </h1>
                        <p className="text-slate-600 text-lg sm:text-xl font-normal leading-relaxed max-w-xl">
                            Buy, sell, swap and visualize second-hand furniture in your own space before you make a move.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link
                                to="/secondhand.html"
                                className="bg-[#0058A3] hover:bg-blue-800 text-white font-bold px-8 py-4 rounded-2xl shadow-lg transition-all active:scale-95 text-sm flex items-center space-x-2"
                            >
                                <span>Design My Room (3D Planner)</span>
                                <span>→</span>
                            </Link>
                            <Link
                                to="/marketplace"
                                className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold px-7 py-4 rounded-2xl transition-all text-sm shadow-sm"
                            >
                                Browse Furniture
                            </Link>
                        </div>

                        {/* Feature Badges */}
                        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/60">
                            <div>
                                <span className="text-2xl font-extrabold text-slate-900">100%</span>
                                <p className="text-xs text-slate-500 font-medium">Verified Pre-Loved Quality</p>
                            </div>
                            <div>
                                <span className="text-2xl font-extrabold text-slate-900">1:1 Scale</span>
                                <p className="text-xs text-slate-500 font-medium">Interactive 3D Simulation</p>
                            </div>
                            <div>
                                <span className="text-2xl font-extrabold text-[#0058A3]">✨ AI</span>
                                <p className="text-xs text-slate-500 font-medium">Instant Spatial Auto-Furnish</p>
                            </div>
                        </div>
                    </div>

                    {/* Right 3D Room Preview Container */}
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-900 h-[480px] group">
                        <img
                            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80"
                            alt="3D Interior Room Preview"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent p-8 flex flex-col justify-end">
                            <span className="bg-[#FFDB00] text-black font-extrabold text-xs px-3 py-1 rounded-full w-fit uppercase tracking-widest mb-2 shadow-md">
                                Live Interactive 3D Canvas
                            </span>
                            <h3 className="text-white text-2xl font-bold">Interactive Room Planner & Digital Twin</h3>
                            <p className="text-slate-300 text-xs mt-1">Drag, rotate, measure clearance, and test furniture fit with collision detection.</p>
                            <div className="mt-4 flex space-x-3">
                                <Link
                                    to="/secondhand.html?demo=classroom"
                                    className="bg-white text-slate-900 font-bold px-4 py-2 rounded-xl text-xs hover:bg-[#FFDB00] transition-colors"
                                >
                                    ✨ Try Classroom Demo
                                </Link>
                                <Link
                                    to="/secondhand.html?demo=living"
                                    className="bg-white/20 text-white font-bold px-4 py-2 rounded-xl text-xs backdrop-blur-md hover:bg-white/30 transition-colors"
                                >
                                    🏠 Try Living Room Demo
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS SECTION */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
                    <span className="text-xs font-bold text-[#0058A3] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                        Seamless 4-Step Process
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">How IKEA Circular Works</h2>
                    <p className="text-slate-600 text-sm">From physical space to pre-loved furniture placement in minutes.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                        { step: "01", title: "Browse or Scan Room", desc: "Select room dimensions, upload photos for VGGT 3D reconstruction, or choose from pre-made templates." },
                        { step: "02", title: "Explore Marketplace", desc: "Find pre-loved Scandinavian furniture with real-world dimensions and up to 60% savings." },
                        { step: "03", title: "Drag & Test in 3D", desc: "Arrange furniture in 1:1 scale, test walking clearance, detect collisions, or ask AI to furnish automatically." },
                        { step: "04", title: "Confirm & Reserve", desc: "Save your layout, check real-time total subtotal, and reserve pre-loved items directly." }
                    ].map((card, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-3">
                            <span className="text-3xl font-black text-[#0058A3]">{card.step}</span>
                            <h3 className="font-bold text-slate-900 text-lg">{card.title}</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">{card.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* SUSTAINABILITY STATS */}
            <section className="bg-slate-900 text-white py-16 px-4">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-6">
                        <span className="text-5xl font-black text-[#FFDB00]">12,450+</span>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mt-2">Furniture Items Rehomed</h4>
                        <p className="text-xs text-slate-400 mt-1">Keeping quality solid wood & steel furniture out of landfills.</p>
                    </div>
                    <div className="p-6 border-y md:border-y-0 md:border-x border-slate-800">
                        <span className="text-5xl font-black text-[#FFDB00]">340 Tons</span>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mt-2">CO₂ Footprint Reduced</h4>
                        <p className="text-xs text-slate-400 mt-1">Preventing new manufacturing emissions through circular reuse.</p>
                    </div>
                    <div className="p-6">
                        <span className="text-5xl font-black text-[#FFDB00]">₹1.4 Cr+</span>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mt-2">Customer Savings</h4>
                        <p className="text-xs text-slate-400 mt-1">Premium furniture made affordable for homes, offices & schools.</p>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-white border-t border-slate-200 py-12 px-4 text-center text-xs text-slate-500">
                <div className="max-w-7xl mx-auto space-y-4">
                    <div className="flex items-center justify-center space-x-2">
                        <img src="/assets/ikea-logo.png" alt="IKEA" className="h-8 w-auto object-contain" />
                        <span className="font-bold text-slate-900">Circular Marketplace &amp; 3D Room Planner</span>
                    </div>
                    <p>© 2026 IKEA Furniture Platform. Designed with Scandinavian minimal visual principles.</p>
                </div>
            </footer>
        </div>
    );
};
