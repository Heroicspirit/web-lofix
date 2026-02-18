"use client";

import { Home, Compass, Search, Library, User, Headphones } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { handleLogout } from "@/lib/actions/auth-action";

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
          <Link href="/user/dashboard">
            <SidebarLink icon={<Home size={20} />} label="Home" active={pathname === "/user/dashboard"} />
          </Link>
          <Link href="/user/browse">
            <SidebarLink icon={<Compass size={20} />} label="Browse" active={pathname === "/user/browse"} />
          </Link>
          <Link href="/user/search">
            <SidebarLink icon={<Search size={20} />} label="Search" active={pathname === "/user/search"} />
          </Link>
          <Link href="/user/library">
            <SidebarLink icon={<Library size={20} />} label="Library" active={pathname === "/user/library"} />
          </Link>
          <Link href="/user/profile">
            <SidebarLink icon={<User size={20} />} label="Profile" active={pathname === "/user/profile"} />
          </Link>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-20 flex items-center justify-between px-10 bg-white/50 backdrop-blur-md">
          <div className="w-96 bg-gray-50 rounded-full px-5 py-2 flex items-center gap-3">
            <Search size={18} className="text-gray-400" />
            <input className="bg-transparent text-sm outline-none w-full" placeholder="Search music..." />
          </div>
          <form action={handleLogout}>
            <button type="submit" className="text-sm font-bold pt-2 hover:text-[#8b5cf6]">
              Logout
            </button>
          </form>
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