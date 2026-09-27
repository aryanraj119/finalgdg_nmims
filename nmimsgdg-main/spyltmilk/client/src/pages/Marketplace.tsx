import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFurnitureStore } from "../store/furnitureStore";
import { useRoomStore } from "../store/roomStore";
import { useUIStore } from "../store/uiStore";
import type { Furniture } from "../types/furniture";

export const Marketplace: React.FC = () => {
    const navigate = useNavigate();

    const catalog = useFurnitureStore((state) => state.catalog);
    const cart = useFurnitureStore((state) => state.cart);
    const addToCart = useFurnitureStore((state) => state.addToCart);

    const addObject = useRoomStore((state) => state.addObject);
    const showToast = useUIStore((state) => state.showToast);

    // Filter states
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSizeFilter, setSelectedSizeFilter] = useState("all");
    const [selectedSort, setSelectedSort] = useState("best");
    const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
        sort: true,
        category: true,
        material: false,
        price: false,
    });
    const [quickFilters, setQuickFilters] = useState<{ [key: string]: boolean }>({
        offers: false,
        topseller: true,
        business: false,
        new: false,
    });

    const [postalCode, setPostalCode] = useState("Enter postal code");

    // Local cart count sync
    const cartCount = cart.length;

    const handleAddToCart = (e: React.MouseEvent, item: Furniture) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(item);

        // Also persist to localStorage for compatibility with static html pages
        try {
            const stored = localStorage.getItem("ikea_cart_items") || "[]";
            const cartItems = JSON.parse(stored);
            const existing = cartItems.find((i: any) => i.id === item.id);
            if (existing) {
                existing.quantity = (existing.quantity || 1) + 1;
            } else {
                cartItems.push({
                    id: item.id,
                    name: item.name,
                    desc: item.description,
                    price: item.price,
                    originalPrice: item.originalPrice || Math.round(item.price * 1.25),
                    image: item.thumbnailUrl || "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80",
                    quantity: 1
                });
            }
            localStorage.setItem("ikea_cart_items", JSON.stringify(cartItems));
        } catch (err) {}

        showToast(`"${item.name}" added to shopping bag.`);
    };

    const handleAddTo3D = (e: React.MouseEvent, item: Furniture) => {
        e.preventDefault();
        e.stopPropagation();
        addObject({
            productId: item.id,
            type: "furniture",
            name: item.name,
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            modelUrl: item.modelUrl || `/models/${item.id}.obj`,
            price: item.price,
            width: item.width || 0.8,
            height: item.height || 0.8,
            depth: item.depth || 0.8,
            condition: item.condition
        });
        showToast(`Added "${item.name}" to 3D Room Planner.`);
        navigate("/secondhand.html");
    };

    const toggleAccordion = (key: string) => {
        setOpenAccordions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleQuickFilter = (key: string) => {
        setQuickFilters(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handlePincodePrompt = () => {
        const code = prompt("Enter your 6-digit delivery pincode:", "400701");
        if (code && code.trim()) {
            setPostalCode(code.trim());
        }
    };

    // Filter products
    const filteredProducts = catalog.filter((item) => {
        const matchSearch =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());

        let matchSize = true;
        const widthCm = item.width ? item.width * 100 : 70;
        if (selectedSizeFilter === "0-39") matchSize = widthCm <= 39;
        else if (selectedSizeFilter === "40-59") matchSize = widthCm >= 40 && widthCm <= 59;
        else if (selectedSizeFilter === "60-79") matchSize = widthCm >= 60 && widthCm <= 79;
        else if (selectedSizeFilter === "80-99") matchSize = widthCm >= 80 && widthCm <= 99;
        else if (selectedSizeFilter === "100+") matchSize = widthCm >= 100;

        let matchTopSeller = true;
        if (quickFilters.topseller) matchTopSeller = item.tags?.includes("Top seller") || item.tags?.includes("Best Seller") || true;

        return matchSearch && matchSize && matchTopSeller;
    });

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (selectedSort === "price-low") return a.price - b.price;
        if (selectedSort === "price-high") return b.price - a.price;
        return 0;
    });

    const everydayEssentials = [
        { id: "ess-001", name: "BEVARA", desc: "Sealing clip, set of 30, assorted colours", price: 49, img: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=300&q=80" },
        { id: "ess-002", name: "PRODUKT", desc: "Milk frother, black", price: 99, img: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=300&q=80" },
        { id: "ess-003", name: "SVARTSIK", desc: "Scissors, set of 3, stainless steel/grey", price: 199, img: "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=300&q=80" },
        { id: "ess-004", name: "SKRUVBY", desc: "Squeegee, black", price: 99, img: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=300&q=80" },
        { id: "ess-005", name: "RINNIG", desc: "Dishwashing brush, white", price: 49, img: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=300&q=80" },
        { id: "ess-006", name: "KORKEN", desc: "Bottle with stopper, clear glass, 1 L", price: 149, img: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=300&q=80" },
    ];

    return (
        <div className="bg-white min-h-screen text-[#111111] font-sans flex flex-col">
            {/* 1. Top Utility Header */}
            <div className="bg-[#111111] text-white text-xs font-medium px-6 py-2 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <span className="cursor-default">
                        <strong className="font-bold">IN</strong> | English
                    </span>
                    <a href="tel:18004194532" className="hover:underline flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>1800 419 4532 for Shopping &amp; Design assistance</span>
                    </a>
                </div>

                <div className="flex items-center space-x-6">
                    <button onClick={handlePincodePrompt} className="hover:underline flex items-center gap-1.5 bg-transparent border-0 text-white cursor-pointer">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{postalCode}</span>
                    </button>
                    <button onClick={() => alert("Stores: IKEA Navi Mumbai, IKEA Hyderabad, IKEA Bengaluru, IKEA Delhi-NCR.")} className="hover:underline flex items-center gap-1.5 bg-transparent border-0 text-white cursor-pointer">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0V5" />
                        </svg>
                        <span>Select store</span>
                    </button>
                </div>
            </div>

            {/* 2. Main Sticky Header */}
            <header className="sticky top-0 z-50 bg-white border-b border-[#dfdfdf] px-6 py-3 shadow-xs">
                <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-6">
                    <div className="flex items-center space-x-8">
                        <Link to="/" className="flex items-center">
                            <img src="/assets/image.png" alt="IKEA" className="h-9 w-auto object-contain block" />
                        </Link>

                        <nav className="hidden lg:flex items-center space-x-6 text-xs font-bold uppercase tracking-wider">
                            <Link to="/marketplace" className="text-[#0058a3] border-b-2 border-[#0058a3] pb-1">Products</Link>
                            <a href="/secondhand.html" className="text-slate-800 hover:text-[#0058a3]">Rooms &amp; 3D</a>
                            <Link to="/marketplace" className="text-slate-800 hover:text-[#0058a3]">Offers</Link>
                            <a href="/intro.html" className="text-slate-800 hover:text-[#0058a3]">Inspiration</a>
                            <a href="/secondhand.html" className="text-slate-800 hover:text-[#0058a3]">Circular Hub</a>
                        </nav>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-xl relative">
                        <svg className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="What are you looking for?"
                            className="w-full bg-[#f5f5f5] hover:bg-[#eaeaea] focus:bg-white text-xs font-medium py-2.5 pl-10 pr-10 rounded-full border border-transparent focus:border-slate-800 outline-none transition-all"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-5">
                        <a href="/login.html" className="flex items-center space-x-1.5 text-xs font-bold text-slate-900 hover:text-[#0058a3]">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="hidden sm:inline">Hey! Log in</span>
                        </a>

                        <a href="/shopping-bag.html" className="relative p-2 text-slate-900 hover:text-[#0058a3]">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#0058a3] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                                    {cartCount}
                                </span>
                            )}
                        </a>
                    </div>
                </div>
            </header>

            {/* 3. Catalog Hero & Width Filter Bar */}
            <div className="max-w-[1440px] mx-auto w-full px-6 pt-6 pb-4">
                <div className="flex items-center space-x-2 text-xs text-slate-500 mb-3">
                    <Link to="/" className="hover:underline">Home</Link> <span>/</span>
                    <Link to="/marketplace" className="hover:underline">Products</Link> <span>/</span>
                    <Link to="/marketplace" className="hover:underline">Storage &amp; organisation</Link> <span>/</span>
                    <span className="text-slate-900 font-medium">Bookcases &amp; shelving units</span>
                </div>

                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Bookcases &amp; shelving units</h1>
                <p className="text-xs text-slate-600 max-w-3xl mt-2 leading-relaxed">
                    Keep clutter at bay with our wide range of bookcases &amp; shelving units. Explore modular storage, pre-loved Scandinavian circular designs, and heavy-duty organizers tailored to your living space.
                </p>

                {/* Horizontal Size Pills */}
                <div className="flex items-center space-x-2 mt-6 overflow-x-auto pb-2 scrollbar-none border-b border-[#dfdfdf]">
                    <span className="text-xs font-bold text-slate-500 mr-2 uppercase tracking-wider">Size (Width)</span>
                    {[
                        { label: "All sizes", count: 311, key: "all" },
                        { label: "0 - 39 cm", count: 42, key: "0-39" },
                        { label: "40 - 59 cm", count: 33, key: "40-59" },
                        { label: "60 - 79 cm", count: 12, key: "60-79" },
                        { label: "80 - 99 cm", count: 140, key: "80-99" },
                        { label: "100+ cm", count: 150, key: "100+" }
                    ].map((pill) => (
                        <button
                            key={pill.key}
                            onClick={() => setSelectedSizeFilter(pill.key)}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                                selectedSizeFilter === pill.key
                                    ? "bg-[#111111] text-white shadow-sm"
                                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-300"
                            }`}
                        >
                            {pill.label} <span className="text-[10px] opacity-70">({pill.count})</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* 4. Main Catalog Section (Sidebar + Product Grid) */}
            <main className="max-w-[1440px] mx-auto w-full px-6 py-6 flex flex-col md:flex-row gap-8 flex-1">
                {/* Left Sidebar Filters */}
                <aside className="w-full md:w-64 flex-shrink-0 space-y-4">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        {sortedProducts.length} items
                    </div>

                    {/* Sort Accordion */}
                    <div className="border-b border-[#dfdfdf] pb-4">
                        <button
                            onClick={() => toggleAccordion("sort")}
                            className="w-full flex items-center justify-between text-sm font-bold text-slate-900 py-2 text-left"
                        >
                            <span>Sort</span>
                            <span>{openAccordions.sort ? "−" : "+"}</span>
                        </button>
                        {openAccordions.sort && (
                            <div className="space-y-2 mt-2 pl-1">
                                {[
                                    { label: "Best match", value: "best" },
                                    { label: "Price: low to high", value: "price-low" },
                                    { label: "Price: high to low", value: "price-high" },
                                    { label: "Customer rating", value: "rating" }
                                ].map((s) => (
                                    <label key={s.value} className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="sort"
                                            checked={selectedSort === s.value}
                                            onChange={() => setSelectedSort(s.value)}
                                            className="accent-[#0058a3]"
                                        />
                                        <span>{s.label}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Checkbox Toggles */}
                    <div className="pt-2 space-y-3">
                        <label className="flex items-center justify-between text-xs font-bold text-slate-900 cursor-pointer">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={quickFilters.topseller}
                                    onChange={() => toggleQuickFilter("topseller")}
                                    className="w-4 h-4 accent-[#0058a3] rounded cursor-pointer"
                                />
                                <span>Top seller</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-normal">54</span>
                        </label>

                        <label className="flex items-center justify-between text-xs font-bold text-slate-900 cursor-pointer">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={quickFilters.offers}
                                    onChange={() => toggleQuickFilter("offers")}
                                    className="w-4 h-4 accent-[#0058a3] rounded cursor-pointer"
                                />
                                <span>Price offers</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-normal">112</span>
                        </label>
                    </div>
                </aside>

                {/* Right Product Grid Area */}
                <section className="flex-1">
                    {/* Controls Bar */}
                    <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
                        <div className="flex items-center space-x-2">
                            <span className="bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                                Top sellers &amp; Verified <span>✓</span>
                            </span>
                        </div>

                        <select
                            value={selectedSort}
                            onChange={(e) => setSelectedSort(e.target.value)}
                            className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 outline-none"
                        >
                            <option value="best">Sort by: Best match</option>
                            <option value="price-low">Price: low to high</option>
                            <option value="price-high">Price: high to low</option>
                        </select>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {sortedProducts.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white border border-[#dfdfdf] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                            >
                                <div>
                                    <div className="relative h-48 bg-slate-50 flex items-center justify-center p-4">
                                        <img
                                            src={item.thumbnailUrl || "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80"}
                                            alt={item.name}
                                            className="max-h-full max-w-full object-contain transition-transform group-hover:scale-105 duration-300"
                                        />
                                        <span className="absolute top-3 left-3 bg-slate-900 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                                            {item.condition}
                                        </span>
                                    </div>

                                    <div className="p-4 space-y-2">
                                        <span className="text-[10px] font-extrabold text-[#0058a3] uppercase tracking-wider block">
                                            {item.category}
                                        </span>
                                        <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-[#0058a3] transition-colors">
                                            {item.name}
                                        </h3>
                                        <p className="text-xs text-slate-500 line-clamp-2 leading-snug">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 pt-0 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-lg font-black text-slate-900">
                                                Rs. {item.price.toLocaleString("en-IN")}
                                            </span>
                                            {item.originalPrice && (
                                                <span className="text-xs text-slate-400 line-through ml-1.5">
                                                    Rs. {item.originalPrice.toLocaleString("en-IN")}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-1.5">
                                        <button
                                            onClick={(e) => handleAddToCart(e, item)}
                                            className="bg-[#0058a3] hover:bg-[#004785] text-white text-[11px] font-bold py-2 rounded-xl transition-all cursor-pointer"
                                        >
                                            🛒 Buy
                                        </button>
                                        <button
                                            onClick={(e) => handleAddToCart(e, item)}
                                            className="bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold py-2 rounded-xl transition-all cursor-pointer"
                                        >
                                            🔄 Swap
                                        </button>
                                        <button
                                            onClick={(e) => handleAddTo3D(e, item)}
                                            className="bg-[#ffdb00] hover:bg-[#ebd000] text-slate-900 text-[11px] font-extrabold py-2 rounded-xl transition-all cursor-pointer"
                                            title="Add to 3D Room Planner"
                                        >
                                            + 3D
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* 5. Everyday Essentials Carousel */}
            <section className="max-w-[1440px] mx-auto w-full px-6 py-8 border-t border-[#dfdfdf]">
                <h2 className="text-xl font-black text-slate-900 mb-4">Everyday essentials for you</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {everydayEssentials.map((item) => (
                        <div key={item.id} className="bg-white border border-[#dfdfdf] rounded-xl p-3 flex flex-col justify-between">
                            <div>
                                <img src={item.img} alt={item.name} className="w-full h-24 object-contain mb-2" />
                                <div className="text-xs font-black text-slate-900 uppercase">{item.name}</div>
                                <div className="text-[11px] text-slate-500 leading-tight mt-0.5">{item.desc}</div>
                            </div>
                            <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                                <span className="text-xs font-black text-slate-900">Rs. {item.price}</span>
                                <button
                                    onClick={(e) => handleAddToCart(e, {
                                        id: item.id,
                                        name: item.name,
                                        category: "Storage",
                                        price: item.price,
                                        thumbnailUrl: item.img,
                                        description: item.desc,
                                        condition: "Like New",
                                        width: 0.3,
                                        height: 0.3,
                                        depth: 0.3,
                                        sellerId: "ikea",
                                        sellerName: "IKEA India",
                                        location: "Navi Mumbai",
                                        available: true
                                    })}
                                    className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center cursor-pointer"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 6. Footer */}
            <footer className="bg-white border-t border-[#dfdfdf] text-slate-700 py-10 px-6 mt-8">
                <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 text-xs">
                    <div>
                        <h3 className="font-extrabold text-slate-900 uppercase tracking-wider mb-3">Join IKEA Family</h3>
                        <p className="text-slate-500 leading-relaxed mb-4">
                            Enjoy member-only discounts &amp; offers, early access to sales, delicious food offers and even more.
                        </p>
                        <a href="/login.html" className="inline-block bg-slate-900 text-white font-bold px-4 py-2 rounded-full">Join now</a>
                    </div>
                    <div>
                        <h3 className="font-extrabold text-slate-900 uppercase tracking-wider mb-3">IKEA Family</h3>
                        <ul className="space-y-2 text-slate-600 font-medium">
                            <li><a href="/login.html">Log in</a></li>
                            <li><a href="/login.html">Join IKEA Family</a></li>
                            <li><Link to="/marketplace">Member offers</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-extrabold text-slate-900 uppercase tracking-wider mb-3">Services</h3>
                        <ul className="space-y-2 text-slate-600 font-medium">
                            <li><a href="/secondhand.html">Delivery Service</a></li>
                            <li><a href="/secondhand.html">Assembly Service</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-extrabold text-slate-900 uppercase tracking-wider mb-3">Help</h3>
                        <ul className="space-y-2 text-slate-600 font-medium">
                            <li><a href="/shopping-bag.html">Shopping Bag ({cartCount})</a></li>
                            <li><a href="/login.html">Account Settings</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-extrabold text-slate-900 uppercase tracking-wider mb-3">About IKEA</h3>
                        <ul className="space-y-2 text-slate-600 font-medium">
                            <li><a href="/intro.html">This is IKEA</a></li>
                            <li><a href="/secondhand.html">Sustainability &amp; Circular Hub</a></li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-[1440px] mx-auto border-t border-slate-200 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
                    <span>© Inter IKEA Systems B.V. 1999-2026. All rights reserved.</span>
                    <div className="flex space-x-4 mt-2 sm:mt-0">
                        <a href="#" className="hover:underline">Privacy policy</a>
                        <a href="#" className="hover:underline">Cookie policy</a>
                    </div>
                </div>
            </footer>

            {/* Floating Quick Action Buttons */}
            <div className="fixed bottom-6 left-6 z-50 flex items-center space-x-3">
                <a
                    href="/secondhand.html"
                    className="bg-[#ffdb00] text-slate-900 font-extrabold text-xs px-5 py-3 rounded-full shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                >
                    <span>✨ 3D Room Planner</span>
                </a>
                <a
                    href="/shopping-bag.html"
                    className="bg-[#0058a3] text-white font-extrabold text-xs px-5 py-3 rounded-full shadow-lg hover:scale-105 transition-all flex items-center gap-2 relative"
                >
                    <span>Shopping Bag</span>
                    {cartCount > 0 && (
                        <span className="bg-white text-[#0058a3] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                            {cartCount}
                        </span>
                    )}
                </a>
            </div>
        </div>
    );
};
