"use client";

import { Home, Compass, Search, Library, User, Headphones } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isDashboard = pathname === "/dashboard";
  if (isDashboard) {
    return <main className="w-full h-full">{children}</main>;
}

  return (
    <div className="flex h-screen bg-white overflow-hidden text-gray-900">
      <aside className="w-64 border-r border-gray-100 flex flex-col py-8 px-6 bg-white">
        <div className="flex items-center gap-2 mb-10 text-[#8b5cf6]">
          <Headphones size={28} strokeWidth={2.5} />
          <span className="text-2xl font-black tracking-tight">Lofix</span>
        </div>
        
        <nav className="space-y-1 flex-1">
          <Link href="/">
            <SidebarLink icon={<Home size={20} />} label="Home" active={pathname === "/"} />
          </Link>
          <SidebarLink icon={<Compass size={20} />} label="Browse" />
          <SidebarLink icon={<Search size={20} />} label="Search" />
          <SidebarLink icon={<Library size={20} />} label="Library" />
          <SidebarLink icon={<User size={20} />} label="Profile" />
        </nav>
      </aside>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-20 flex items-center justify-between px-10 bg-white/50 backdrop-blur-md">
          <div className="w-96 bg-gray-50 rounded-full px-5 py-2 flex items-center gap-3">
            <Search size={18} className="text-gray-400" />
            <input className="bg-transparent text-sm outline-none w-full" placeholder="Search music..." />
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="text-sm font-bold pt-2 hover:text-[#8b5cf6]">Log in</Link>
            <Link href="/register" className="bg-[#8b5cf6] text-white px-6 py-2 rounded-full text-sm font-bold shadow-md hover:bg-[#7c3aed]">
              Sign up
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-10 pb-10">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-4 px-4 py-3 rounded-2xl cursor-pointer transition-all ${
      active ? 'bg-purple-50 text-[#8b5cf6]' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
    }`}>
      {icon}
      <span className="font-bold text-sm">{label}</span>
    </div>
  );
}