"use client";
import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";
import { AuthProvider } from "@/context/AuthContext";
// 1. Import Toast components
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <div className='flex w-full min-h-screen'>
                <div className='page-wrapper flex w-full'>
                    {/* Sidebar */}
                    <div className='xl:block hidden'>
                        <Sidebar />
                    </div>
                    
                    <div className='w-full bg-background'>
                        {/* Top Header */}
                        <Header />
                        
                        {/* Body Content */}
                        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 p-2">
                            {children}
                        </main>
                    </div>
                </div>
            </div>

            {/* 2. Place ToastContainer here - it will listen for toasts from any child component */}
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored" // Or "dark" to match your dashboard
            />
        </AuthProvider>
    );
}