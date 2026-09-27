import React, { useEffect, useState } from "react";
import { Navbar } from "../components/ui/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { roomService } from "../services/roomService";
import type { RoomState } from "../types/room";
import { useRoomStore } from "../store/roomStore";
import { useUIStore } from "../store/uiStore";

export const RoomDetails: React.FC = () => {
    const navigate = useNavigate();
    const [savedRooms, setSavedRooms] = useState<RoomState[]>([]);

    const setRoomDimensions = useRoomStore((state) => state.setRoomDimensions);
    const showToast = useUIStore((state) => state.showToast);

    useEffect(() => {
        roomService.getSavedRooms().then(setSavedRooms);
    }, []);

    const handleLoadRoom = (room: RoomState) => {
        setRoomDimensions(room.width, room.length, room.height);
        showToast(`Loaded "${room.name}"`);
        navigate("/secondhand.html");
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900">My Saved 3D Rooms</h1>
                        <p className="text-xs text-slate-500 mt-1">Manage and edit your saved digital twins and room layouts.</p>
                    </div>

                    <Link
                        to="/secondhand.html"
                        className="px-6 py-2.5 bg-[#0058A3] hover:bg-blue-800 text-white font-bold rounded-full text-xs shadow-md transition-all"
                    >
                        + Create New Room
                    </Link>
                </div>

                {savedRooms.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-md mx-auto">
                        <div className="p-4 rounded-full bg-slate-100 w-16 h-16 mx-auto flex items-center justify-center text-slate-400">
                            🏢
                        </div>
                        <h3 className="font-bold text-slate-800 text-base">No Saved Rooms Yet</h3>
                        <p className="text-xs text-slate-500">
                            Design a 3D room or try one of our demo room templates.
                        </p>
                        <div className="flex justify-center space-x-3 pt-2">
                            <Link
                                to="/secondhand.html?demo=classroom"
                                className="px-4 py-2 bg-[#FFDB00] text-black font-bold text-xs rounded-xl shadow-sm"
                            >
                                Try Classroom Demo
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {savedRooms.map((room) => (
                            <div key={room.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                                <div>
                                    <span className="text-[10px] font-bold text-[#0058A3] uppercase tracking-wider">{room.type}</span>
                                    <h3 className="font-bold text-slate-900 text-lg mt-1">{room.name}</h3>
                                    <p className="text-xs text-slate-500 mt-1 font-mono">
                                        Dimensions: {room.width}m × {room.length}m × {room.height}m
                                    </p>
                                    <p className="text-xs text-slate-500">Items: {room.objects.length}</p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-[10px] text-slate-400">Saved locally</span>
                                    <button
                                        onClick={() => handleLoadRoom(room)}
                                        className="px-4 py-2 bg-[#0058A3] text-white font-bold text-xs rounded-xl hover:bg-blue-800 transition-colors"
                                    >
                                        Edit in 3D Planner →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
