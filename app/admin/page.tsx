import { LayoutDashboard, Users, Activity, ShieldCheck } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="min-h-screen p-4 lg:p-8 bg-white dark:bg-[#09090b] transition-colors duration-300">
            <div className="max-w-7xl mx-auto space-y-8">
                
                
                <div className="relative overflow-hidden p-8 lg:p-12 rounded-[2.5rem] bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 shadow-sm">
                    
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                        
                        <div className="relative">
                            <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full animate-pulse" />
                            <div className="relative w-20 h-20 bg-white dark:bg-zinc-900 rounded-3xl flex items-center justify-center border border-gray-100 dark:border-zinc-800 shadow-2xl">
                                <LayoutDashboard className="w-10 h-10 text-purple-600" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-zinc-100 tracking-tight">
                                Admin <span className="text-purple-600">Dashboard</span>
                            </h1>
                            <p className="text-gray-500 dark:text-zinc-400 max-w-md mx-auto text-base">
                                Welcome back! Manage your users.
                            </p>
                        </div>

                        
                    </div>
                </div>
                
            </div>
        </div>
    );
}

