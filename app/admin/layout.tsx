"use client";
import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";
import { AuthProvider } from "@/context/AuthContext";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            {/* BACKGROUND CHANGE: 
                Swapped #F8F9FC (White) for #0B0F1A (Deep Charcoal Navy).
                Added selection:bg-blue-500/30 for better dark-mode text selection.
            */}
            <div className='flex w-full min-h-screen bg-[#0B0F1A] text-slate-300 selection:bg-blue-500/30 selection:text-white'>
                
                {/* SIDEBAR CONTAINER: 
                    The p-4 padding keeps the sidebar "floating" against the dark backdrop.
                */}
                <div className='xl:block hidden sticky top-0 h-screen p-4 pr-0'>
                    <Sidebar />
                </div>
                
                <div className='flex-1 flex flex-col min-w-0 relative'>
                    {/* HEADER CONTAINER:
                        Kept sticky. The glass effect in Header.tsx will now blur 
                        dark content instead of white.
                    */}
                    <div className="sticky top-0 z-40 px-6 py-4">
                        <Header />
                    </div>
                    
                    {/* MAIN CANVAS: 
                        The stage is now a deep matte color. 
                    */}
                    <main className="flex-1 px-8 pb-12 animate-in fade-in slide-in-from-bottom-2 duration-700">
                        {children}
                    </main>
                </div>
            </div>
        </AuthProvider>
    );
}