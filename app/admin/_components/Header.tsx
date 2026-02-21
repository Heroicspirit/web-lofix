"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User, Bell, Command } from "lucide-react";

export default function Header() {
    const { logout, user } = useAuth();

    return (
        <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
                <div className="flex h-20 items-center justify-between">
                    
                    {/* Search / Context Hint */}
                    <div className="hidden md:flex items-center gap-3 text-slate-400 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 cursor-text group">
                        <Command size={14} />
                        <span className="text-xs font-bold uppercase tracking-widest group-hover:text-slate-600 transition-colors">
                            Search Command
                        </span>
                        <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200">⌘K</span>
                    </div>

                    {/* Right Side: Profile & Actions */}
                    <div className="flex items-center gap-4">
                        <button className="p-2.5 text-slate-400 hover:text-cyan-600 transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-cyan-500 rounded-full border-2 border-white" />
                        </button>

                        <div className="h-8 w-[1px] bg-slate-100 mx-2" />

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-black text-slate-900 leading-none capitalize">
                                    {user?.email?.split('@')[0] || 'Admin'}
                                </p>
                                <p className="text-[10px] font-bold text-cyan-600 uppercase tracking-tighter mt-1">Super Admin</p>
                            </div>
                            
                            <button
                                onClick={() => logout()}
                                className="group flex items-center gap-2 bg-slate-50 hover:bg-red-50 p-2 rounded-2xl border border-slate-100 hover:border-red-100 transition-all"
                            >
                                <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:text-red-600">
                                    <LogOut size={16} />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}