import React, { useState } from "react";
import RoomPlannerHUD from "../components/RoomPlannerHUD";

interface Seller {
    name: string;
    verified: boolean;
    rating: number;
    transactions: number;
    phoneVerified: boolean;
    productVerified: boolean;
    communityMember: boolean;
    avatar?: string;
}

interface Product {
    id: number;
    name: string;
    category: "Sofas" | "Tables" | "Chairs" | "Storage" | "Desks" | "Beds" | "Lighting";
    condition: "Like New" | "Good" | "Refurbished" | "Excellent";
    originalPrice: number;
    secondHandPrice: number;
    image: string;
    location: string;
    distanceKm: number;
    description: string;
    dimensions: string; // e.g. "210 × 85 × 90 cm"
    seller: Seller;
    swapAvailable: boolean;
    modelUrl?: string;
    savings: number;
}

const INITIAL_PRODUCTS: Product[] = [
    {
        id: 1,
        name: "KALLAX Shelf Unit 4x4 - White",
        category: "Storage",
        condition: "Like New",
        originalPrice: 7500,
        secondHandPrice: 3200,
        image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=800&q=80",
        location: "Koramangala, Bengaluru",
        distanceKm: 2.1,
        description: "Versatile cube shelving unit in pristine white. Includes 4 canvas insert baskets. Perfect for living room or studio storage.",
        dimensions: "147 × 39 × 147 cm",
        seller: {
            name: "Rahul Sharma",
            verified: true,
            rating: 4.8,
            transactions: 23,
            phoneVerified: true,
            productVerified: true,
            communityMember: true
        },
        swapAvailable: true,
        savings: 57
    },
    {
        id: 2,
        name: "SÖDERHAMN 3-Seater Fabric Sofa - Slate Gray",
        category: "Sofas",
        condition: "Good",
        originalPrice: 18000,
        secondHandPrice: 8500,
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
        location: "Indiranagar, Bengaluru",
        distanceKm: 4.2,
        description: "Deep, low-profile modular Scandinavian sofa with removable washable covers. Thoroughly steam cleaned.",
        dimensions: "210 × 85 × 90 cm",
        seller: {
            name: "Rahul Sharma",
            verified: true,
            rating: 4.8,
            transactions: 23,
            phoneVerified: true,
            productVerified: true,
            communityMember: true
        },
        swapAvailable: true,
        modelUrl: "/models/OBJ/couch.obj",
        savings: 53
    },
    {
        id: 3,
        name: "STRANDMON Wing Chair - Nordvalla Dark Gray",
        category: "Chairs",
        condition: "Excellent",
        originalPrice: 9900,
        secondHandPrice: 4200,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
        location: "HSR Layout, Bengaluru",
        distanceKm: 1.8,
        description: "Classic high-backed wing armchair with soft dark gray fabric and solid oak tapered legs. Very comfortable.",
        dimensions: "82 × 96 × 101 cm",
        seller: {
            name: "Aarav Sharma",
            verified: true,
            rating: 4.7,
            transactions: 15,
            phoneVerified: true,
            productVerified: true,
            communityMember: true
        },
        swapAvailable: true,
        modelUrl: "/models/OBJ/chairs.obj",
        savings: 58
    },
    {
        id: 4,
        name: "LISABO Solid Ash Wood Dining Table",
        category: "Tables",
        condition: "Good",
        originalPrice: 12500,
        secondHandPrice: 5400,
        image: "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=800&q=80",
        location: "Whitefield, Bengaluru",
        distanceKm: 3.5,
        description: "Sturdy ash wood dining table seats 6 comfortably. Matte clear varnish finish with smooth rounded corners.",
        dimensions: "140 × 78 × 74 cm",
        seller: {
            name: "Kabir Mehta",
            verified: true,
            rating: 4.9,
            transactions: 19,
            phoneVerified: true,
            productVerified: true,
            communityMember: true
        },
        swapAvailable: true,
        modelUrl: "/models/OBJ/center_table.obj",
        savings: 57
    },
    {
        id: 5,
        name: "HEMNES 4-Door Storage Wardrobe",
        category: "Storage",
        condition: "Excellent",
        originalPrice: 26000,
        secondHandPrice: 11500,
        image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80",
        location: "Jayanagar, Bengaluru",
        distanceKm: 5.1,
        description: "Spacious solid wood 4-door wardrobe cabinet featuring smooth drawer glides and hanging rods.",
        dimensions: "180 × 60 × 210 cm",
        seller: {
            name: "Anita Roy",
            verified: true,
            rating: 5.0,
            transactions: 58,
            phoneVerified: true,
            productVerified: true,
            communityMember: true
        },
        swapAvailable: true,
        modelUrl: "/models/OBJ/wardrobe_4door.obj",
        savings: 56
    },
    {
        id: 6,
        name: "MARKUS Ergonomic Mesh Workstation Desk",
        category: "Desks",
        condition: "Excellent",
        originalPrice: 10500,
        secondHandPrice: 4200,
        image: "https://images.unsplash.com/photo-1580481077198-98e3c4a86ce9?auto=format&fit=crop&w=800&q=80",
        location: "Bandra, Mumbai",
        distanceKm: 2.9,
        description: "Heavy-duty study and workstation desk with steel frame legs and integrated cable management grommet.",
        dimensions: "140 × 70 × 75 cm",
        seller: {
            name: "Vikram Malhotra",
            verified: true,
            rating: 4.8,
            transactions: 32,
            phoneVerified: true,
            productVerified: true,
            communityMember: true
        },
        swapAvailable: true,
        modelUrl: "/models/OBJ/desk.obj",
        savings: 60
    },
    {
        id: 7,
        name: "MALM Queen Platform Bed Frame",
        category: "Beds",
        condition: "Like New",
        originalPrice: 22000,
        secondHandPrice: 8999,
        image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
        location: "Indiranagar, Bengaluru",
        distanceKm: 3.8,
        description: "Clean queen platform bed frame with wooden slatted base and low-profile headboard.",
        dimensions: "160 × 200 × 90 cm",
        seller: {
            name: "Devendra Verma",
            verified: true,
            rating: 4.6,
            transactions: 12,
            phoneVerified: true,
            productVerified: true,
            communityMember: true
        },
        swapAvailable: true,
        modelUrl: "/models/OBJ/full_bed.obj",
        savings: 59
    },
    {
        id: 8,
        name: "FJÄLLBO Industrial Coffee Table",
        category: "Tables",
        condition: "Good",
        originalPrice: 6500,
        secondHandPrice: 2499,
        image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80",
        location: "Koramangala, Bengaluru",
        distanceKm: 1.2,
        description: "Rustic coffee table with solid pine top and black powder-coated steel mesh lower shelf.",
        dimensions: "90 × 46 × 47 cm",
        seller: {
            name: "Neha Gupta",
            verified: true,
            rating: 4.9,
            transactions: 27,
            phoneVerified: true,
            productVerified: true,
            communityMember: true
        },
        swapAvailable: true,
        savings: 61
    }
];

const CATEGORIES = ["All", "Sofas", "Tables", "Chairs", "Storage", "Desks", "Beds"];
const CONDITIONS = ["All Conditions", "Like New", "Good", "Excellent", "Refurbished"];
const DISTANCE_OPTIONS = [
    { label: "All Distances", value: 999 },
    { label: "Within 2 km", value: 2 },
    { label: "Within 5 km", value: 5 },
    { label: "Within 10 km", value: 10 }
];

const SecondHandFurniture: React.FC = () => {
    const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedCondition, setSelectedCondition] = useState("All Conditions");
    const [maxDistance, setMaxDistance] = useState(999);
    const [swapOnlyFilter, setSwapOnlyFilter] = useState(false);
    const [sortOption, setSortOption] = useState<"Recommended" | "PriceLow" | "PriceHigh" | "Distance">("Recommended");
    const [searchQuery, setSearchQuery] = useState("");
    const [toastMsg, setToastMsg] = useState<string | null>(null);

    // Swap Credit Calculator State
    const [calcCategory, setCalcCategory] = useState("Chairs");
    const [calcCondition, setCalcCondition] = useState("Good");
    const [calcEstValue, setCalcEstValue] = useState(2400);

    // Modal States
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isSellModalOpen, setIsSellModalOpen] = useState(false);
    const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
    const [swapProduct, setSwapProduct] = useState<Product | null>(null);
    const [reportProduct, setReportProduct] = useState<Product | null>(null);

    // Sell Form Multi-Step State
    const [sellStep, setSellStep] = useState(1);
    const [sellForm, setSellForm] = useState({
        name: "",
        category: "Sofas" as Product["category"],
        condition: "Good" as Product["condition"],
        originalPrice: "",
        secondHandPrice: "",
        description: "",
        dimensions: "120 × 60 × 75 cm",
        location: "Koramangala, Bengaluru",
        swapAvailable: true,
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80"
    });

    // Checkout Form State
    const [checkoutForm, setCheckoutForm] = useState({
        deliveryMethod: "delivery", // 'delivery' | 'pickup'
        paymentMethod: "upi", // 'upi' | 'card' | 'cash' | 'credits'
        isConfirmed: false,
        orderId: ""
    });

    // Swap Form State
    const [swapForm, setSwapForm] = useState({
        offeredItemName: "Birch Desk Chair",
        offeredItemEstValue: 2000,
        isConfirmed: false,
        swapCode: ""
    });

    // Report Form State
    const [reportReason, setReportReason] = useState("Fraudulent / Fake Listing");

    const showToast = (msg: string) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 4000);
    };

    // Filter & Sort Logic
    const filteredProducts = products
        .filter((p) => {
            const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
            const matchesCondition = selectedCondition === "All Conditions" || p.condition === selectedCondition;
            const matchesDistance = p.distanceKm <= maxDistance;
            const matchesSwap = !swapOnlyFilter || p.swapAvailable;
            const matchesSearch =
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesCondition && matchesDistance && matchesSwap && matchesSearch;
        })
        .sort((a, b) => {
            if (sortOption === "PriceLow") return a.secondHandPrice - b.secondHandPrice;
            if (sortOption === "PriceHigh") return b.secondHandPrice - a.secondHandPrice;
            if (sortOption === "Distance") return a.distanceKm - b.distanceKm;
            return 0; // Recommended default
        });

    // Publish New Listing Handler
    const handlePublishListing = (e: React.FormEvent) => {
        e.preventDefault();
        const orig = parseFloat(sellForm.originalPrice) || 10000;
        const sh = parseFloat(sellForm.secondHandPrice) || 4500;
        const sav = Math.round(((orig - sh) / orig) * 100);

        const newProduct: Product = {
            id: Date.now(),
            name: sellForm.name || "Pre-Loved Furniture Item",
            category: sellForm.category,
            condition: sellForm.condition,
            originalPrice: orig,
            secondHandPrice: sh,
            image: sellForm.image,
            location: sellForm.location,
            distanceKm: 1.5,
            description: sellForm.description || "Gently used second-hand furniture ready for a new home.",
            dimensions: sellForm.dimensions,
            seller: {
                name: "You (Verified Seller)",
                verified: true,
                rating: 5.0,
                transactions: 1,
                phoneVerified: true,
                productVerified: true,
                communityMember: true
            },
            swapAvailable: sellForm.swapAvailable,
            savings: Math.max(10, sav)
        };

        setProducts([newProduct, ...products]);
        setIsSellModalOpen(false);
        setSellStep(1);
        showToast(`Published listing "${newProduct.name}" to Marketplace!`);
    };

    // Confirm Buy Handler
    const handleConfirmBuy = () => {
        const generatedId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
        setCheckoutForm({ ...checkoutForm, isConfirmed: true, orderId: generatedId });
        showToast(`Order #${generatedId} confirmed successfully!`);
    };

    // Confirm Swap Handler
    const handleConfirmSwap = () => {
        const generatedCode = `SWAP-${Math.floor(10000 + Math.random() * 90000)}`;
        setSwapForm({ ...swapForm, isConfirmed: true, swapCode: generatedCode });
        showToast(`Swap request #${generatedCode} submitted!`);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
            {/* Notification Toast */}
            {toastMsg && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#0051BA] text-white px-6 py-3 rounded-full text-xs font-bold shadow-2xl animate-bounce flex items-center space-x-2 border border-blue-400/40">
                    <span className="bg-[#FFDA1A] text-black w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black">✓</span>
                    <span>{toastMsg}</span>
                </div>
            )}

            {/* HEADER NAVIGATION */}
            <header className="sticky top-0 z-40 bg-[#0051BA] text-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
                    <a href="/intro" className="flex items-center space-x-2">
                        <img src="/assets/ikea-logo.png" alt="IKEA" className="h-9 w-auto object-contain block" />
                        <span className="text-xl font-bold tracking-tight text-white hidden sm:inline">
                            Secondhand Furniture <span className="text-xs bg-[#FFDA1A] text-[#0051BA] px-2 py-0.5 rounded-full font-bold uppercase ml-1">Marketplace</span>
                        </span>
                    </a>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-md mx-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder='Search "KALLAX", sofas, tables...'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-full bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FFDA1A] text-xs font-semibold shadow-inner"
                            />
                            <svg className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Header Actions */}
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setIsSellModalOpen(true)}
                            className="bg-[#FFDA1A] hover:bg-yellow-400 text-[#0051BA] font-extrabold text-xs px-4 py-2.5 rounded-full shadow-lg transition-all flex items-center space-x-1.5 active:scale-95 cursor-pointer"
                        >
                            <span>➕ Sell / Swap</span>
                        </button>
                        <a
                            href="/shopping-bag.html"
                            className="relative p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer flex items-center justify-center"
                            title="Shopping Cart"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <span className="bag-badge" id="header-bag-count" style={{position: "absolute", top: "-4px", right: "-4px", background: "#FFDA1A", color: "#0051BA", fontSize: "10px", fontWeight: "900", minWidth: "18px", height: "18px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #0051BA"}}>0</span>
                        </a>
                        <a href="/" className="text-xs font-bold text-blue-100 hover:text-white transition-colors">
                            ← Home
                        </a>
                    </div>
                </div>
            </header>

            {/* HERO HERO & CIRCULAR BANNER */}
            <section className="bg-gradient-to-r from-[#0051BA] via-[#003B87] to-slate-900 text-white py-12 px-4 shadow-md">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="max-w-2xl space-y-4">
                        <div className="inline-flex items-center space-x-2 bg-[#FFDA1A] text-[#0051BA] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
                            <span>SECONDHAND</span>
                            <span>•</span>
                            <span>Save up to 60%</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                            Buy, Sell & Swap <span className="text-[#FFDA1A]">Pre-Loved Furniture</span>
                        </h1>
                        <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
                            Verified seller profiles, distance tracking, instant 3D room previewing, and zero-waste furniture swap credits.
                        </p>
                        <div className="flex flex-wrap gap-3 pt-2">
                            <button
                                onClick={() => setIsSellModalOpen(true)}
                                className="bg-[#FFDA1A] text-[#0051BA] font-extrabold text-xs px-6 py-3 rounded-full hover:bg-yellow-400 transition-all shadow-lg active:scale-95 cursor-pointer"
                            >
                                Sell or Swap Your Furniture
                            </button>
                            <a
                                href="#marketplace"
                                className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-6 py-3 rounded-full transition-all border border-white/30"
                            >
                                Browse Listings ↓
                            </a>
                        </div>
                    </div>

                    {/* Trust Badges Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center">
                            <span className="text-2xl font-black text-[#FFDA1A]">✓ Verified</span>
                            <p className="text-[10px] text-blue-100 uppercase font-bold mt-1">ID & Phone Checked</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center">
                            <span className="text-2xl font-black text-[#FFDA1A]">🔄 Swaps</span>
                            <p className="text-[10px] text-blue-100 uppercase font-bold mt-1">Trade Credits</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center col-span-2 sm:col-span-1">
                            <span className="text-2xl font-black text-[#FFDA1A]">📐 3D Ready</span>
                            <p className="text-[10px] text-blue-100 uppercase font-bold mt-1">See in Your Room</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3D ROOM PLANNER INTEGRATION BAR */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <span className="text-[10px] font-extrabold uppercase text-[#0058A3] tracking-widest bg-blue-100/80 border border-blue-300/60 px-3 py-1 rounded-full">
                            Interactive 3D Planner
                        </span>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                            Visualize Secondhand Furniture in 3D
                        </h2>
                    </div>
                </div>
                <RoomPlannerHUD />
            </section>

            {/* MAIN MARKETPLACE SECTION (SECTION 1) */}
            <section id="marketplace" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* CATEGORIES PILLS & FILTERS & SORT */}
                <div className="space-y-4 pb-6 border-b border-slate-200">
                    {/* Category Pills & Swap Filter Toggle */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin flex-1">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${selectedCategory === cat
                                            ? "bg-[#0051BA] text-white shadow-md"
                                            : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                                        }`}
                                >
                                    {cat === "All" ? "[ All Items ]" : `[ ${cat} ]`}
                                </button>
                            ))}
                        </div>

                        {/* Swap Available Only Toggle */}
                        <button
                            onClick={() => setSwapOnlyFilter(!swapOnlyFilter)}
                            className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-1.5 border ${swapOnlyFilter
                                    ? "bg-purple-700 text-white border-purple-700 shadow-md animate-pulse"
                                    : "bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100"
                                }`}
                        >
                            <span>🔄 Swap Only</span>
                            {swapOnlyFilter && <span className="bg-white text-purple-800 w-4 h-4 rounded-full flex items-center justify-center text-[10px]">✓</span>}
                        </button>
                    </div>

                    {/* Filter & Sort Controls Row */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                        <div className="flex flex-wrap items-center gap-3 text-xs">
                            {/* Condition Filter */}
                            <div className="flex items-center space-x-1.5">
                                <span className="font-bold text-slate-500 uppercase">Condition:</span>
                                <select
                                    value={selectedCondition}
                                    onChange={(e) => setSelectedCondition(e.target.value)}
                                    className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0051BA]"
                                >
                                    {CONDITIONS.map((cond) => (
                                        <option key={cond} value={cond}>
                                            {cond}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Distance Filter */}
                            <div className="flex items-center space-x-1.5">
                                <span className="font-bold text-slate-500 uppercase">Distance:</span>
                                <select
                                    value={maxDistance}
                                    onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
                                    className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0051BA]"
                                >
                                    {DISTANCE_OPTIONS.map((opt) => (
                                        <option key={opt.label} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Sort Selector */}
                        <div className="flex items-center space-x-2 text-xs">
                            <span className="font-bold text-slate-500 uppercase">Sort:</span>
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value as any)}
                                className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0051BA]"
                            >
                                <option value="Recommended">Recommended</option>
                                <option value="PriceLow">Price: Low to High</option>
                                <option value="PriceHigh">Price: High to Low</option>
                                <option value="Distance">Distance: Nearest</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* DEDICATED FURNITURE SWAP & TRADE CREDITS HUB WIDGET */}
                <div className="my-6 p-6 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-xl border border-purple-500/30 flex flex-col lg:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 max-w-xl">
                        <div className="inline-flex items-center space-x-1.5 bg-purple-500/20 border border-purple-400/30 px-3 py-1 rounded-full text-[10px] font-black uppercase text-purple-300 tracking-widest">
                            <span>🔄 Furniture Swap & Trade Credits</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black">Trade Your Old Furniture & Pay Only the Difference</h3>
                        <p className="text-xs text-purple-200 leading-relaxed">
                            Have pre-loved furniture? Swap it directly with other verified sellers or turn it into instant Swap Credits (Your balance: <span className="text-[#FFDA1A] font-extrabold">₹5,400</span>).
                        </p>
                    </div>

                    {/* Interactive Trade-In Estimator Box */}
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 w-full lg:w-80 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-extrabold text-white">Trade-In Value Estimator</span>
                            <span className="text-[#FFDA1A] font-black text-sm">~₹{calcEstValue.toLocaleString("en-IN")}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <select
                                value={calcCategory}
                                onChange={(e) => {
                                    const cat = e.target.value;
                                    setCalcCategory(cat);
                                    const mult = cat === "Sofas" ? 6500 : cat === "Beds" ? 5000 : cat === "Desks" ? 3200 : 2400;
                                    setCalcEstValue(mult);
                                }}
                                className="bg-slate-900 text-white border border-slate-700 rounded-xl px-2 py-1.5 text-[11px] font-bold"
                            >
                                <option value="Chairs">Chairs</option>
                                <option value="Desks">Desks</option>
                                <option value="Tables">Tables</option>
                                <option value="Sofas">Sofas</option>
                                <option value="Beds">Beds</option>
                            </select>

                            <select
                                value={calcCondition}
                                onChange={(e) => {
                                    const cond = e.target.value;
                                    setCalcCondition(cond);
                                    const factor = cond === "Like New" ? 1.3 : cond === "Excellent" ? 1.1 : 0.9;
                                    setCalcEstValue(Math.round(calcEstValue * factor));
                                }}
                                className="bg-slate-900 text-white border border-slate-700 rounded-xl px-2 py-1.5 text-[11px] font-bold"
                            >
                                <option value="Like New">Like New</option>
                                <option value="Excellent">Excellent</option>
                                <option value="Good">Good</option>
                            </select>
                        </div>

                        <button
                            onClick={() => setIsSellModalOpen(true)}
                            className="w-full py-2 rounded-xl bg-[#FFDA1A] hover:bg-yellow-400 text-[#0051BA] font-extrabold text-xs shadow-md transition-all cursor-pointer"
                        >
                            🔄 Swap / Trade My Furniture Now
                        </button>
                    </div>
                </div>

                {/* FURNITURE CARDS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => setSelectedProduct(product)}
                            className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
                        >
                            {/* Card Image */}
                            <div className="relative h-56 overflow-hidden bg-slate-100">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-3 left-3 flex flex-col gap-1">
                                    <span
                                        className={`px-2.5 py-1 rounded-full text-[10px] font-black text-white shadow-sm uppercase tracking-wide ${product.condition === "Like New"
                                                ? "bg-emerald-600"
                                                : product.condition === "Refurbished"
                                                    ? "bg-blue-600"
                                                    : product.condition === "Excellent"
                                                        ? "bg-indigo-600"
                                                        : "bg-amber-600"
                                            }`}
                                    >
                                        {product.condition}
                                    </span>
                                    {product.swapAvailable && (
                                        <span className="bg-purple-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm flex items-center space-x-1">
                                            <span>🔄 Swap Available</span>
                                        </span>
                                    )}
                                </div>

                                <div className="absolute top-3 right-3 bg-[#FFDA1A] text-[#0051BA] font-black text-[10px] px-2.5 py-1 rounded-full shadow-md">
                                    Save {product.savings}%
                                </div>
                            </div>

                            {/* Card Details */}
                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-extrabold text-slate-900 text-base group-hover:text-[#0051BA] transition-colors leading-snug line-clamp-1">
                                        {product.name}
                                    </h3>

                                    {/* Price & Savings */}
                                    <div className="flex items-baseline space-x-2 mt-1.5">
                                        <span className="text-xl font-black text-slate-900">₹{product.secondHandPrice.toLocaleString("en-IN")}</span>
                                        <span className="text-xs text-slate-400 line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
                                    </div>

                                    {/* Seller Verification & Distance */}
                                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs">
                                        <div className="flex items-center justify-between text-slate-700 font-bold">
                                            <span className="truncate pr-1 flex items-center space-x-1">
                                                <span>{product.seller.name}</span>
                                                {product.seller.verified && (
                                                    <span className="text-blue-600 text-[11px]" title="Verified Seller">✓</span>
                                                )}
                                            </span>
                                            <span className="text-slate-500 font-mono text-[11px] whitespace-nowrap">📍 {product.distanceKm} km</span>
                                        </div>
                                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                                            <span>⭐ {product.seller.rating} ({product.seller.transactions} tx)</span>
                                            <span className="truncate max-w-[120px]">{product.location}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* CARD ACTION BUTTONS (BUY, SWAP, DETAILS) */}
                                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if ((window as any).addToIkeaCart) {
                                                (window as any).addToIkeaCart({
                                                    id: 'sh-00' + product.id,
                                                    name: product.name,
                                                    price: product.secondHandPrice,
                                                    originalPrice: product.originalPrice,
                                                    category: product.category,
                                                    condition: product.condition,
                                                    description: product.description,
                                                    image: product.image
                                                }, e.currentTarget);
                                            }
                                        }}
                                        className="flex-1 py-1.5 rounded-xl bg-[#0051BA] hover:bg-blue-700 text-white font-extrabold text-[11px] shadow-sm transition-all cursor-pointer"
                                        title="Add to Shopping Bag"
                                    >
                                        Add to cart
                                    </button>
                                    {product.swapAvailable && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSwapProduct(product);
                                            }}
                                            className="flex-1 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-[11px] shadow-sm transition-all cursor-pointer"
                                        >
                                            🔄 Swap
                                        </button>
                                    )}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedProduct(product);
                                        }}
                                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] cursor-pointer"
                                    >
                                        Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* TRUST & SAFETY SECTION (SECTION 5) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-200 mt-12 bg-white rounded-3xl shadow-sm">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                    <span className="bg-blue-100 text-[#0051BA] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                        Trust & Safety Guaranteed
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                        Safe, Transparent Secondhand Transactions
                    </h2>
                    <p className="text-slate-500 text-xs sm:text-sm">
                        Every listing on IKEA Secondhand undergoes seller verification and buyer protection checks.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                        <span className="text-2xl">✓</span>
                        <h4 className="font-extrabold text-sm text-slate-900">Verified Sellers</h4>
                        <p className="text-xs text-slate-500">Phone number, government ID, and past transaction ratings verified before publishing.</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                        <span className="text-2xl">⭐</span>
                        <h4 className="font-extrabold text-sm text-slate-900">Community Ratings</h4>
                        <p className="text-xs text-slate-500">Transparent buyer reviews, star ratings, and completed transaction histories.</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                        <span className="text-2xl">🛡️</span>
                        <h4 className="font-extrabold text-sm text-slate-900">Buyer Protection</h4>
                        <p className="text-xs text-slate-500">Escrow payment hold until item inspection and pickup/delivery confirmation.</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                        <span className="text-2xl">📍</span>
                        <h4 className="font-extrabold text-sm text-slate-900">Safe Pickup Locations</h4>
                        <p className="text-xs text-slate-500">Geofenced location tracking with designated public meet-up hubs.</p>
                    </div>
                </div>
            </section>


            {/* ========================================================= */}
            {/* MODAL 1: ITEM DETAIL PAGE / MODAL (SECTION 3)            */}
            {/* ========================================================= */}
            {selectedProduct && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white text-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
                        {/* Header Bar */}
                        <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                            <span className="text-xs font-black uppercase text-[#0051BA] tracking-wider">Item Details</span>
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 font-bold text-slate-600 flex items-center justify-center text-sm"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                            {/* Large Image Preview */}
                            <div className="relative h-72 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                                <img
                                    src={selectedProduct.image}
                                    alt={selectedProduct.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 left-3 bg-emerald-600 text-white font-black text-xs px-3 py-1 rounded-full shadow-md">
                                    Condition: {selectedProduct.condition}
                                </div>
                                <div className="absolute top-3 right-3 bg-[#FFDA1A] text-[#0051BA] font-black text-xs px-3 py-1 rounded-full shadow-md">
                                    Save {selectedProduct.savings}%
                                </div>
                            </div>

                            {/* Title & Price */}
                            <div className="space-y-2">
                                <h2 className="text-2xl font-black text-slate-900">{selectedProduct.name}</h2>
                                <div className="flex items-baseline space-x-3">
                                    <span className="text-3xl font-black text-slate-900">₹{selectedProduct.secondHandPrice.toLocaleString("en-IN")}</span>
                                    <span className="text-base text-slate-400 line-through font-semibold">Originally ₹{selectedProduct.originalPrice.toLocaleString("en-IN")}</span>
                                </div>
                            </div>

                            {/* Description & Dimensions */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                                    <span className="text-[10px] font-black uppercase text-slate-400 block">Description</span>
                                    <p className="text-xs font-semibold text-slate-700 leading-relaxed">{selectedProduct.description}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                                    <span className="text-[10px] font-black uppercase text-slate-400 block">Dimensions & Location</span>
                                    <p className="text-xs font-bold text-slate-800">📐 {selectedProduct.dimensions}</p>
                                    <p className="text-xs font-semibold text-slate-600 pt-1">📍 {selectedProduct.distanceKm} km away • {selectedProduct.location}</p>
                                </div>
                            </div>

                            {/* TRUSTED SELLER PROFILE CARD */}
                            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-[#0051BA] text-white font-black flex items-center justify-center text-sm shadow-md">
                                            {selectedProduct.seller.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-1.5">
                                                <span className="font-extrabold text-sm text-slate-900">{selectedProduct.seller.name}</span>
                                                {selectedProduct.seller.verified && (
                                                    <span className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">✓ Verified</span>
                                                )}
                                            </div>
                                            <div className="text-[11px] text-slate-500 font-semibold flex items-center space-x-2">
                                                <span>⭐ {selectedProduct.seller.rating} rating</span>
                                                <span>•</span>
                                                <span>{selectedProduct.seller.transactions} completed transactions</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Verification Badges Row */}
                                <div className="flex flex-wrap gap-2 text-[10px] font-bold text-blue-900">
                                    <span className="bg-white px-2.5 py-1 rounded-full border border-blue-200">✓ Phone verified</span>
                                    <span className="bg-white px-2.5 py-1 rounded-full border border-blue-200">✓ Product verified</span>
                                    <span className="bg-white px-2.5 py-1 rounded-full border border-blue-200">✓ Community member</span>
                                </div>
                            </div>

                            {/* ACTION BUTTONS (SECTION 3 & 4 & 3D PLANNER) */}
                            <div className="space-y-3 pt-2">
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => {
                                            window.location.href = `/checkout.html?productId=sh-00${selectedProduct.id}`;
                                        }}
                                        className="py-3 px-4 rounded-2xl bg-[#0051BA] hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg transition-all active:scale-95 cursor-pointer"
                                    >
                                        Buy Now
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSwapProduct(selectedProduct);
                                            setSelectedProduct(null);
                                        }}
                                        className="py-3 px-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-lg transition-all active:scale-95 cursor-pointer"
                                    >
                                        [ REQUEST SWAP ]
                                    </button>
                                </div>

                                <a
                                    href="/secondhand.html#planner"
                                    onClick={() => setSelectedProduct(null)}
                                    className="w-full py-3 rounded-2xl bg-[#FFDA1A] hover:bg-yellow-400 text-[#0051BA] font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                                >
                                    <span>📦 [ SEE IN MY ROOM (3D) ]</span>
                                </a>

                                <div className="pt-2 text-center">
                                    <button
                                        onClick={() => {
                                            setReportProduct(selectedProduct);
                                            setSelectedProduct(null);
                                        }}
                                        className="text-[11px] text-red-600 hover:underline font-bold"
                                    >
                                        🚩 Report Listing
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* ========================================================= */}
            {/* MODAL 2: ITEM LISTING CREATION (SELL/SWAP FLOW - SECTION 2)*/}
            {/* ========================================================= */}
            {isSellModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white text-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95">
                        <div className="p-4 bg-[#0051BA] text-white flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-black uppercase text-[#FFDA1A] block">2. Item Listing Creation</span>
                                <h3 className="font-extrabold text-base">Sell or Swap Your Furniture</h3>
                            </div>
                            <button
                                onClick={() => setIsSellModalOpen(false)}
                                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-sm flex items-center justify-center"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Step Progress Bar */}
                        <div className="bg-slate-100 p-3 flex items-center justify-between text-[11px] font-extrabold border-b border-slate-200 text-slate-600">
                            <span className={sellStep >= 1 ? "text-[#0051BA]" : ""}>1. Identify</span>
                            <span>→</span>
                            <span className={sellStep >= 2 ? "text-[#0051BA]" : ""}>2. Photos</span>
                            <span>→</span>
                            <span className={sellStep >= 3 ? "text-[#0051BA]" : ""}>3. Condition</span>
                            <span>→</span>
                            <span className={sellStep >= 4 ? "text-[#0051BA]" : ""}>4. Price</span>
                            <span>→</span>
                            <span className={sellStep >= 5 ? "text-[#0051BA]" : ""}>5. Publish</span>
                        </div>

                        <form onSubmit={handlePublishListing} className="p-6 space-y-5">
                            {sellStep === 1 && (
                                <div className="space-y-4">
                                    <h4 className="font-extrabold text-sm text-slate-900">Step 1: Select / Identify Furniture</h4>
                                    <div>
                                        <label className="text-xs font-bold text-slate-700 block mb-1">Furniture Title / Model Name</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. KALLAX Shelving Unit 4x4 or Birch Desk Chair"
                                            value={sellForm.name}
                                            onChange={(e) => setSellForm({ ...sellForm, name: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0051BA]"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                                        <select
                                            value={sellForm.category}
                                            onChange={(e) => setSellForm({ ...sellForm, category: e.target.value as any })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0051BA]"
                                        >
                                            {CATEGORIES.filter(c => c !== "All").map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setSellStep(2)}
                                        className="w-full py-2.5 rounded-xl bg-[#0051BA] text-white font-bold text-xs shadow-md"
                                    >
                                        Next: Upload Photos →
                                    </button>
                                </div>
                            )}

                            {sellStep === 2 && (
                                <div className="space-y-4">
                                    <h4 className="font-extrabold text-sm text-slate-900">Step 2: Upload Photos / 3D Asset</h4>
                                    <div className="border-2 border-dashed border-slate-300 p-6 rounded-2xl text-center space-y-2 bg-slate-50">
                                        <span className="text-3xl">📷</span>
                                        <p className="text-xs font-bold text-slate-700">Drag and drop photos or click to select</p>
                                        <span className="text-[10px] text-slate-400 block">PNG, JPG or OBJ supported up to 50MB</span>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-700 block mb-1">Photo Image URL (Demo Preview)</label>
                                        <input
                                            type="text"
                                            value={sellForm.image}
                                            onChange={(e) => setSellForm({ ...sellForm, image: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                                        />
                                    </div>

                                    <div className="flex space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => setSellStep(1)}
                                            className="w-1/3 py-2.5 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs"
                                        >
                                            ← Back
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSellStep(3)}
                                            className="w-2/3 py-2.5 rounded-xl bg-[#0051BA] text-white font-bold text-xs shadow-md"
                                        >
                                            Next: Condition →
                                        </button>
                                    </div>
                                </div>
                            )}

                            {sellStep === 3 && (
                                <div className="space-y-4">
                                    <h4 className="font-extrabold text-sm text-slate-900">Step 3: Condition & Description</h4>
                                    <div>
                                        <label className="text-xs font-bold text-slate-700 block mb-1">Condition Rating</label>
                                        <select
                                            value={sellForm.condition}
                                            onChange={(e) => setSellForm({ ...sellForm, condition: e.target.value as any })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                                        >
                                            <option value="Like New">Like New (Pristine condition)</option>
                                            <option value="Good">Good (Minor wear, fully functional)</option>
                                            <option value="Excellent">Excellent (Minimal signs of use)</option>
                                            <option value="Refurbished">Refurbished (Inspected & restored)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-700 block mb-1">Dimensions (W × D × H)</label>
                                        <input
                                            type="text"
                                            value={sellForm.dimensions}
                                            onChange={(e) => setSellForm({ ...sellForm, dimensions: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
                                        <textarea
                                            rows={3}
                                            value={sellForm.description}
                                            onChange={(e) => setSellForm({ ...sellForm, description: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                                            placeholder="Describe age, usage history, features..."
                                        />
                                    </div>

                                    <div className="flex space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => setSellStep(2)}
                                            className="w-1/3 py-2.5 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs"
                                        >
                                            ← Back
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSellStep(4)}
                                            className="w-2/3 py-2.5 rounded-xl bg-[#0051BA] text-white font-bold text-xs shadow-md"
                                        >
                                            Next: Pricing & Swap →
                                        </button>
                                    </div>
                                </div>
                            )}

                            {sellStep === 4 && (
                                <div className="space-y-4">
                                    <h4 className="font-extrabold text-sm text-slate-900">Step 4: Pricing & Swap Options</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs font-bold text-slate-700 block mb-1">Selling Price (₹)</label>
                                            <input
                                                type="number"
                                                required
                                                placeholder="3200"
                                                value={sellForm.secondHandPrice}
                                                onChange={(e) => setSellForm({ ...sellForm, secondHandPrice: e.target.value })}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-extrabold text-slate-900"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-700 block mb-1">Original Price (₹)</label>
                                            <input
                                                type="number"
                                                placeholder="7500"
                                                value={sellForm.originalPrice}
                                                onChange={(e) => setSellForm({ ...sellForm, originalPrice: e.target.value })}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                                            />
                                        </div>
                                    </div>

                                    <label className="flex items-center space-x-2 p-3 bg-purple-50 rounded-xl border border-purple-200 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={sellForm.swapAvailable}
                                            onChange={(e) => setSellForm({ ...sellForm, swapAvailable: e.target.checked })}
                                            className="w-4 h-4 text-purple-600 rounded"
                                        />
                                        <span className="text-xs font-extrabold text-purple-900">Enable Furniture Swap & Trade Credits</span>
                                    </label>

                                    <div className="flex space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => setSellStep(3)}
                                            className="w-1/3 py-2.5 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs"
                                        >
                                            ← Back
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSellStep(5)}
                                            className="w-2/3 py-2.5 rounded-xl bg-[#0051BA] text-white font-bold text-xs shadow-md"
                                        >
                                            Preview Listing →
                                        </button>
                                    </div>
                                </div>
                            )}

                            {sellStep === 5 && (
                                <div className="space-y-4">
                                    <h4 className="font-extrabold text-sm text-slate-900">Step 5: Preview & Publish</h4>
                                    <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50 space-y-2">
                                        <h5 className="font-black text-slate-900 text-base">{sellForm.name || "Untitled Furniture"}</h5>
                                        <p className="text-xs font-extrabold text-[#0051BA]">₹{sellForm.secondHandPrice || 0} • Condition: {sellForm.condition}</p>
                                        <p className="text-xs text-slate-600">{sellForm.description}</p>
                                    </div>

                                    <div className="flex space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => setSellStep(4)}
                                            className="w-1/3 py-2.5 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs"
                                        >
                                            ← Edit
                                        </button>
                                        <button
                                            type="submit"
                                            className="w-2/3 py-3 rounded-xl bg-[#FFDA1A] text-[#0051BA] font-black text-xs shadow-lg"
                                        >
                                            🚀 Publish Listing Now
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            )}


            {/* ========================================================= */}
            {/* MODAL 3: BUY NOW TRANSACTION CHECKOUT (SECTION 4)         */}
            {/* ========================================================= */}
            {checkoutProduct && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white text-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95">
                        <div className="p-4 bg-[#0051BA] text-white flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-black uppercase text-[#FFDA1A] block">4. Transaction Mechanism</span>
                                <h3 className="font-extrabold text-base">Buy Secondhand Furniture</h3>
                            </div>
                            <button
                                onClick={() => {
                                    setCheckoutProduct(null);
                                    setCheckoutForm({ deliveryMethod: "delivery", paymentMethod: "upi", isConfirmed: false, orderId: "" });
                                }}
                                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-sm flex items-center justify-center"
                            >
                                ✕
                            </button>
                        </div>

                        {!checkoutForm.isConfirmed ? (
                            <div className="p-6 space-y-5">
                                {/* Product Summary */}
                                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                                    <img src={checkoutProduct.image} alt="" className="w-14 h-14 rounded-xl object-cover" />
                                    <div>
                                        <h4 className="font-extrabold text-xs text-slate-900">{checkoutProduct.name}</h4>
                                        <span className="text-sm font-black text-slate-900">₹{checkoutProduct.secondHandPrice.toLocaleString("en-IN")}</span>
                                    </div>
                                </div>

                                {/* Delivery vs Pickup */}
                                <div className="space-y-2">
                                    <label className="text-xs font-extrabold text-slate-700 block">Fulfillment Method</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setCheckoutForm({ ...checkoutForm, deliveryMethod: "delivery" })}
                                            className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${checkoutForm.deliveryMethod === "delivery"
                                                    ? "border-[#0051BA] bg-blue-50 text-[#0051BA]"
                                                    : "border-slate-200 text-slate-600"
                                                }`}
                                        >
                                            🚚 Home Delivery (+₹299)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setCheckoutForm({ ...checkoutForm, deliveryMethod: "pickup" })}
                                            className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${checkoutForm.deliveryMethod === "pickup"
                                                    ? "border-[#0051BA] bg-blue-50 text-[#0051BA]"
                                                    : "border-slate-200 text-slate-600"
                                                }`}
                                        >
                                            🚗 Self Pickup (Free)
                                        </button>
                                    </div>
                                </div>

                                {/* Payment Methods */}
                                <div className="space-y-2">
                                    <label className="text-xs font-extrabold text-slate-700 block">Payment Method</label>
                                    <select
                                        value={checkoutForm.paymentMethod}
                                        onChange={(e) => setCheckoutForm({ ...checkoutForm, paymentMethod: e.target.value })}
                                        className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                                    >
                                        <option value="upi">📱 UPI (Google Pay / PhonePe / Paytm)</option>
                                        <option value="card">💳 Credit / Debit Card</option>
                                        <option value="cash">💵 Cash on Pickup / Delivery</option>
                                        <option value="credits">⭐ Swap Credits Balance (₹5,400 avail)</option>
                                    </select>
                                </div>

                                {/* Price Total */}
                                <div className="pt-3 border-t border-slate-200 space-y-1 text-xs">
                                    <div className="flex justify-between text-slate-600 font-semibold">
                                        <span>Item Price:</span>
                                        <span>₹{checkoutProduct.secondHandPrice.toLocaleString("en-IN")}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600 font-semibold">
                                        <span>Fulfillment Fee:</span>
                                        <span>{checkoutForm.deliveryMethod === "delivery" ? "₹299" : "Free"}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
                                        <span>Total Payable:</span>
                                        <span className="text-[#0051BA]">
                                            ₹{(checkoutProduct.secondHandPrice + (checkoutForm.deliveryMethod === "delivery" ? 299 : 0)).toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleConfirmBuy}
                                    className="w-full py-3 rounded-2xl bg-[#0051BA] hover:bg-blue-700 text-white font-black text-xs shadow-lg transition-all"
                                >
                                    Confirm & Pay Now →
                                </button>
                            </div>
                        ) : (
                            /* Order Confirmed Screen */
                            <div className="p-6 text-center space-y-4">
                                <span className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto font-black">
                                    ✓
                                </span>
                                <h4 className="text-xl font-black text-slate-900">Order Confirmed!</h4>
                                <p className="text-xs font-bold text-slate-600">
                                    Order ID: <span className="font-mono text-[#0051BA]">{checkoutForm.orderId}</span>
                                </p>
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-left space-y-1">
                                    <p className="font-bold text-slate-800">Estimated Fulfillment: Tomorrow, 2:00 PM</p>
                                    <p className="text-slate-500">Seller: {checkoutProduct.seller.name} (Verified)</p>
                                    <p className="text-slate-500">Escrow Payment Held Safely</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setCheckoutProduct(null);
                                        setCheckoutForm({ deliveryMethod: "delivery", paymentMethod: "upi", isConfirmed: false, orderId: "" });
                                    }}
                                    className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
                                >
                                    Done
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}


            {/* ========================================================= */}
            {/* MODAL 4: REQUEST SWAP MECHANISM (SECTION 4)               */}
            {/* ========================================================= */}
            {swapProduct && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white text-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95">
                        <div className="p-4 bg-purple-700 text-white flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-black uppercase text-purple-200 block">Furniture Swap Mechanism</span>
                                <h3 className="font-extrabold text-base">Request Furniture Swap</h3>
                            </div>
                            <button
                                onClick={() => {
                                    setSwapProduct(null);
                                    setSwapForm({ offeredItemName: "Birch Desk Chair", offeredItemEstValue: 2000, isConfirmed: false, swapCode: "" });
                                }}
                                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-sm flex items-center justify-center"
                            >
                                ✕
                            </button>
                        </div>

                        {!swapForm.isConfirmed ? (
                            <div className="p-6 space-y-5">
                                {/* Target Item */}
                                <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 space-y-1">
                                    <span className="text-[10px] font-extrabold uppercase text-purple-700 block">Target Item to Acquire</span>
                                    <h4 className="font-black text-slate-900 text-xs">{swapProduct.name}</h4>
                                    <p className="text-xs font-bold text-purple-900">Listed Value: ₹{swapProduct.secondHandPrice.toLocaleString("en-IN")}</p>
                                </div>

                                {/* Select Your Item to Swap */}
                                <div className="space-y-2">
                                    <label className="text-xs font-extrabold text-slate-700 block">Choose Your Furniture to Offer</label>
                                    <select
                                        value={swapForm.offeredItemName}
                                        onChange={(e) => {
                                            const name = e.target.value;
                                            const val = name.includes("Chair") ? 2000 : name.includes("Desk") ? 3500 : 1500;
                                            setSwapForm({ ...swapForm, offeredItemName: name, offeredItemEstValue: val });
                                        }}
                                        className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                                    >
                                        <option value="Birch Desk Chair">Birch Desk Chair (Est. Value ₹2,000)</option>
                                        <option value="Compact Study Desk">Compact Study Desk (Est. Value ₹3,500)</option>
                                        <option value="Wooden Side Table">Wooden Side Table (Est. Value ₹1,500)</option>
                                    </select>
                                </div>

                                {/* Swap Value Difference Calculation */}
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                                    <span className="font-extrabold text-slate-900 block">Swap Credit & Value Difference</span>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Target Item Value:</span>
                                        <span>₹{swapProduct.secondHandPrice.toLocaleString("en-IN")}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Your Offered Item:</span>
                                        <span>- ₹{swapForm.offeredItemEstValue.toLocaleString("en-IN")}</span>
                                    </div>
                                    <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-slate-900">
                                        <span>Net Difference Settlement:</span>
                                        <span className="text-purple-700">
                                            {swapProduct.secondHandPrice >= swapForm.offeredItemEstValue
                                                ? `Pay Difference: ₹${(swapProduct.secondHandPrice - swapForm.offeredItemEstValue).toLocaleString("en-IN")}`
                                                : `Receive Credit: ₹${(swapForm.offeredItemEstValue - swapProduct.secondHandPrice).toLocaleString("en-IN")}`}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleConfirmSwap}
                                    className="w-full py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs shadow-lg transition-all"
                                >
                                    Submit Swap Request →
                                </button>
                            </div>
                        ) : (
                            /* Swap Confirmed Screen */
                            <div className="p-6 text-center space-y-4">
                                <span className="w-16 h-16 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-3xl mx-auto font-black">
                                    🔄
                                </span>
                                <h4 className="text-xl font-black text-slate-900">Swap Requested!</h4>
                                <p className="text-xs font-bold text-slate-600">
                                    Swap Code: <span className="font-mono text-purple-700">{swapForm.swapCode}</span>
                                </p>
                                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-left space-y-1">
                                    <p className="font-bold text-purple-900">Swap Proposal Sent to {swapProduct.seller.name}</p>
                                    <p className="text-purple-700">Value Settlement: Net difference held in escrow</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setSwapProduct(null);
                                        setSwapForm({ offeredItemName: "Birch Desk Chair", offeredItemEstValue: 2000, isConfirmed: false, swapCode: "" });
                                    }}
                                    className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}


            {/* ========================================================= */}
            {/* MODAL 5: REPORT LISTING MODAL (SECTION 5 TRUST & SAFETY)  */}
            {/* ========================================================= */}
            {reportProduct && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white text-slate-900 w-full max-w-sm rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
                        <h4 className="font-black text-base text-red-600 flex items-center space-x-1">
                            <span>🚩 Report Listing</span>
                        </h4>
                        <p className="text-xs font-semibold text-slate-600">Reporting "{reportProduct.name}"</p>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 block">Reason for Report</label>
                            <select
                                value={reportReason}
                                onChange={(e) => setReportReason(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold"
                            >
                                <option value="Fraudulent / Fake Listing">Fraudulent / Fake Listing</option>
                                <option value="Incorrect Condition Rating">Incorrect Condition Rating</option>
                                <option value="Misleading Photos">Misleading Photos</option>
                                <option value="Unresponsive Seller">Unresponsive Seller</option>
                            </select>
                        </div>

                        <div className="flex space-x-2 pt-2">
                            <button
                                onClick={() => setReportProduct(null)}
                                className="w-1/2 py-2.5 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setReportProduct(null);
                                    showToast("Report submitted to IKEA Trust & Safety team.");
                                }}
                                className="w-1/2 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs"
                            >
                                Submit Report
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SecondHandFurniture;
