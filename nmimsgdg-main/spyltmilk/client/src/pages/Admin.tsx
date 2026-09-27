import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const Admin: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"orders" | "catalog" | "planner">("orders");

    useEffect(() => {
        const loggedIn = localStorage.getItem("ikea_admin_logged_in") === "true";
        if (!loggedIn) {
            // Auto login for prototype / demo mode
            localStorage.setItem("ikea_admin_logged_in", "true");
            localStorage.setItem(
                "ikea_user",
                JSON.stringify({
                    id: "admin",
                    email: "admin@ikea.com",
                    name: "IKEA Administrator",
                    role: "Administrator",
                    isAdmin: true,
                })
            );
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("ikea_admin_logged_in");
        localStorage.removeItem("ikea_user");
        localStorage.removeItem("ikea_user_name");
        alert("Logged out of Admin Portal.");
        window.location.href = "/login.html";
    };

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
            {/* Header */}
            <header className="bg-[#0058a3] text-white px-8 py-4 flex items-center justify-between shadow-md">
                <div className="flex items-center space-x-4">
                    <Link to="/" className="bg-white p-1 rounded">
                        <img src="/assets/ikea-logo.png" alt="IKEA" className="h-6 w-auto" />
                    </Link>
                    <div className="text-xl font-extrabold flex items-center gap-3">
                        IKEA Admin Portal
                        <span className="bg-[#ffdb00] text-slate-900 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                            Demo Mode
                        </span>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <span className="text-sm font-semibold">👤 Logged in as admin</span>
                    <button
                        onClick={handleLogout}
                        className="bg-white/20 hover:bg-white/30 text-white border border-white/40 text-xs font-bold px-4 py-1.5 rounded-full transition-all"
                    >
                        Log out
                    </button>
                </div>
            </header>

            {/* Prototype Notice Banner */}
            <div className="bg-amber-50 border-b border-amber-200 px-8 py-2.5 text-xs text-amber-800 font-semibold flex items-center justify-between">
                <div>
                    ℹ️ <strong>Prototype Authentication Flow:</strong> Logged in with demo credentials:{" "}
                    <code className="bg-amber-200/80 px-1.5 py-0.5 rounded text-amber-900 font-mono">admin / admin</code>
                </div>
                <div className="space-x-4">
                    <Link to="/marketplace" className="underline hover:text-amber-950">Marketplace</Link>
                    <a href="/secondhand.html" className="underline hover:text-amber-950">3D Room Planner</a>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl w-full mx-auto px-6 py-8 flex-1">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900">Administrator Dashboard</h1>
                        <p className="text-sm text-slate-600 mt-1">Manage catalog, orders, 3D room planner sessions, and VGGT models.</p>
                    </div>

                    <div className="flex space-x-3">
                        <a
                            href="/secondhand.html"
                            className="bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold px-4 py-2.5 rounded-full transition-all"
                        >
                            ✨ 3D Room Planner
                        </a>
                        <Link
                            to="/marketplace"
                            className="bg-[#0058a3] text-white hover:bg-[#004785] text-xs font-bold px-4 py-2.5 rounded-full transition-all"
                        >
                            🛍️ Marketplace
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Revenue</div>
                        <div className="text-3xl font-black text-slate-900">₹1,24,850</div>
                        <div className="text-xs font-semibold text-emerald-600 mt-1">↑ +18.4% this month</div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Active Orders</div>
                        <div className="text-3xl font-black text-slate-900">48</div>
                        <div className="text-xs font-semibold text-emerald-600 mt-1">12 Pending Delivery</div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">3D Room Sessions</div>
                        <div className="text-3xl font-black text-slate-900">124</div>
                        <div className="text-xs font-semibold text-[#0058a3] mt-1">Classroom & Living Room Active</div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">2nd Hand Listings</div>
                        <div className="text-3xl font-black text-slate-900">34</div>
                        <div className="text-xs font-semibold text-emerald-600 mt-1">95% Pass Rate</div>
                    </div>
                </div>

                {/* Panel Card */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
                    <div className="flex border-b border-slate-200 bg-slate-50/80">
                        <button
                            onClick={() => setActiveTab("orders")}
                            className={`px-6 py-4 text-sm font-bold border-b-2 transition-all ${
                                activeTab === "orders" ? "border-[#0058a3] text-[#0058a3] bg-white" : "border-transparent text-slate-600 hover:text-slate-900"
                            }`}
                        >
                            Recent Orders
                        </button>
                        <button
                            onClick={() => setActiveTab("catalog")}
                            className={`px-6 py-4 text-sm font-bold border-b-2 transition-all ${
                                activeTab === "catalog" ? "border-[#0058a3] text-[#0058a3] bg-white" : "border-transparent text-slate-600 hover:text-slate-900"
                            }`}
                        >
                            Catalog & Inventory
                        </button>
                        <button
                            onClick={() => setActiveTab("planner")}
                            className={`px-6 py-4 text-sm font-bold border-b-2 transition-all ${
                                activeTab === "planner" ? "border-[#0058a3] text-[#0058a3] bg-white" : "border-transparent text-slate-600 hover:text-slate-900"
                            }`}
                        >
                            3D Models & VGGT Scanner
                        </button>
                    </div>

                    <div className="p-6">
                        {activeTab === "orders" && (
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/50">
                                        <th className="p-3">Order ID</th>
                                        <th className="p-3">Customer</th>
                                        <th className="p-3">Items</th>
                                        <th className="p-3">Store Location</th>
                                        <th className="p-3">Total</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <tr>
                                        <td className="p-3 font-bold">#IK-9824</td>
                                        <td className="p-3">Ananya Singh</td>
                                        <td className="p-3">KIVIK 3-seater Sofa + LACK Coffee Table</td>
                                        <td className="p-3">Navi Mumbai</td>
                                        <td className="p-3 font-bold">₹34,990</td>
                                        <td className="p-3"><span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full">Processing</span></td>
                                        <td className="p-3"><button onClick={() => alert("Order #IK-9824 dispatched!")} className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-1 rounded">Dispatch</button></td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 font-bold">#IK-9823</td>
                                        <td className="p-3">Rahul Sharma</td>
                                        <td className="p-3">MARKUS Office Chair (2nd Hand)</td>
                                        <td className="p-3">Hyderabad</td>
                                        <td className="p-3 font-bold">₹7,490</td>
                                        <td className="p-3"><span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">Delivered</span></td>
                                        <td className="p-3"><button onClick={() => alert("Receipt #IK-9823")} className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-1 rounded">View</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        )}

                        {activeTab === "catalog" && (
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/50">
                                        <th className="p-3">Product</th>
                                        <th className="p-3">Category</th>
                                        <th className="p-3">Condition</th>
                                        <th className="p-3">Price</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <tr>
                                        <td className="p-3 font-bold">KIVIK 3-Seater Sofa</td>
                                        <td className="p-3">Sofas</td>
                                        <td className="p-3">Like New</td>
                                        <td className="p-3 font-bold">₹24,990</td>
                                        <td className="p-3"><span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">In Stock (4)</span></td>
                                        <td className="p-3"><button onClick={() => alert("Edit item")} className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-1 rounded">Edit</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        )}

                        {activeTab === "planner" && (
                            <div className="space-y-4">
                                <h3 className="font-bold text-slate-900">3D Models & Room Pipeline</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                        <div className="font-bold text-[#0058a3] mb-1">✨ Classroom 3D Demo Room</div>
                                        <div className="text-xs text-slate-600 mb-3">Loaded with 14 interactive 3D furniture models</div>
                                        <a href="/secondhand.html?demo=classroom" className="text-xs font-bold text-slate-900 underline">Open Classroom Demo &rarr;</a>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                        <div className="font-bold text-[#0058a3] mb-1">📷 VGGT Room Scanner Pipeline</div>
                                        <div className="text-xs text-slate-600 mb-3">Real-time room layout & object detection</div>
                                        <Link to="/scan" className="text-xs font-bold text-slate-900 underline">Open VGGT Scanner &rarr;</Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
                IKEA Admin Portal — Demo Prototype Authentication Flow (Credentials: admin / admin)
            </footer>
        </div>
    );
};
