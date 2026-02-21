"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Music, Settings, LogOut, Zap } from "lucide-react";

const ADMIN_LINKS = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "User Base", icon: Users },
    { href: "/admin/songs", label: "Music Library", icon: Music },
];

export default function Sidebar() {
    const pathname = usePathname();
    const isActive = (href: string) => href === "/admin" ? pathname === href : pathname?.startsWith(href);

    return (
        <aside className="fixed md:sticky top-0 left-0 h-screen w-64 bg-[#0F172A] border-r border-slate-800 z-40 flex flex-col">
            <div className="p-8">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-900/40">
                        <Zap size={20} className="text-white fill-white" />
                    </div>
                    <span className="text-xl font-black text-white tracking-tight">Lofix</span>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1.5">
                {ADMIN_LINKS.map((link) => {
                    const Icon = link.icon;
                    const active = isActive(link.href);
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition-all
                                ${active 
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
                        >
                            <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                            <span>{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6">
                <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/50">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Admin Account</p>
                </div>
            </div>
        </aside>
    );
}