import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useFurnitureStore } from "../../store/furnitureStore";

export const Navbar: React.FC = () => {
    const location = useLocation();
    const cart = useFurnitureStore((state) => state.cart);

    const navItems = [
        { label: "2nd Hand Furniture", path: "/marketplace" },
        { label: "3D Room Planner", path: "/secondhand.html" },
        { label: "Scan Room (VGGT)", path: "/scan" },
        { label: "My Rooms", path: "/my-rooms" }
    ];

    return (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                {/* Brand Logo */}
                <Link to="/intro" aria-label="IKEA Home" className="flex items-center space-x-3 group">
                    <span className="bg-slate-900 text-white font-extrabold text-2xl px-3.5 py-1 rounded-xl tracking-tighter shadow-md group-hover:bg-[#0058A3] transition-colors">IKEA</span>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">Circular Hub</span>
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5">2nd Hand Furniture &amp; 3D Planner</span>
                    </div>
                </Link>

                {/* Navigation Links */}
                <nav className="hidden md:flex items-center space-x-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/80">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${isActive
                                        ? "bg-slate-900 text-white shadow-sm"
                                        : "text-slate-700 hover:text-slate-900 hover:bg-white/60"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center space-x-4">
                    {/* Try Demo Room CTA */}
                    <Link
                        to="/secondhand.html?demo=classroom"
                        className="hidden lg:inline-flex items-center space-x-1.5 bg-[#FFDB00] hover:bg-[#ebd000] text-slate-900 px-4 py-2 rounded-full text-xs font-bold shadow-sm transition-all active:scale-95"
                    >
                        <span>✨ Try Demo Room</span>
                    </Link>

                    {/* Cart Button */}
                    <a
                        href="/shopping-bag.html"
                        className="relative p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center justify-center"
                        title="Shopping Cart"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span className="bag-badge" id="header-bag-count" style={{position: "absolute", top: "-4px", right: "-4px", background: "#0058A3", color: "#fff", fontSize: "10px", fontWeight: "900", minWidth: "18px", height: "18px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff"}}>{cart.length}</span>
                    </a>
                </div>
            </div>
        </header>
    );
};
