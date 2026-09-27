import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// SPYLT Milk Landing Page Components
import Navbar from "./components/Navbar";
import PreLoader from "./components/PreLoader";
import HeroSection from "./sections/HeroSection";
import MessageSection from "./sections/MessageSection";
import FlavorSection from "./sections/FlavorSection";
import NutritionSection from "./sections/NutritionSection";
import BenifitSection from "./sections/BenifitSection";
import TestimonialSection from "./sections/TestimonialSection";
import BottomBanner from "./sections/BottomBanner";
import FooterSection from "./sections/FooterSection";

// 3D Planner & Marketplace Pages
import { Home } from "./pages/Home";
import { Marketplace } from "./pages/Marketplace";
import { Planner } from "./pages/Planner";
import { ScanRoom } from "./pages/ScanRoom";
import { RoomDetails } from "./pages/RoomDetails";
import { ProductDetails } from "./pages/ProductDetails";
import SecondHandFurniture from "./pages/SecondHandFurniture";
import { Admin } from "./pages/Admin";

const SpyltMilkLandingPage: React.FC = () => {
    return (
        <main className="relative min-h-screen w-full bg-[#faeade] overflow-x-hidden">
            <PreLoader />
            <Navbar />
            <HeroSection />
            <MessageSection />
            <FlavorSection />
            <NutritionSection />
            <BenifitSection />
            <TestimonialSection />
            <BottomBanner />
            <FooterSection />
        </main>
    );
};

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* SPYLT Milk Homepage */}
                <Route path="/" element={<SpyltMilkLandingPage />} />
                
                {/* 2nd Hand Furniture & 3D Room Planner Routes */}
                <Route path="/secondhand.html" element={<Planner />} />
                <Route path="/planner" element={<Navigate to="/secondhand.html" replace />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/scan" element={<ScanRoom />} />
                <Route path="/my-rooms" element={<RoomDetails />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/home" element={<Home />} />
                <Route path="/legacy" element={<SecondHandFurniture />} />
                <Route path="/admin" element={<Admin />} />
                
                <Route path="*" element={<SpyltMilkLandingPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;