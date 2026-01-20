"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react"; // Added useState
import { Mail, Lock, User, Headphones } from "lucide-react";
import { registerSchema, type RegisterData } from "../schema";
import { handleRegister } from "@/lib/actions/auth-action"; // Import your action

export default function RegisterForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [serverError, setServerError] = useState<string | null>(null); // State for API errors

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (values: RegisterData) => {
        setServerError(null); // Clear previous errors
        
        startTransition(async () => {
            try {
                // 1. Call the Server Action
                const result = await handleRegister(values);

                if (result.success) {
                    // 2. On success, move to login
                    router.push("/login");
                } else {
                    // 3. Capture backend error message
                    setServerError(result.message);
                }
            } catch (err) {
                setServerError("An unexpected error occurred. Please try again.");
            }
        });
    };

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-col items-center text-center">
                <div className="flex items-center gap-2 mb-2">
                    <Headphones className="w-6 h-6 text-[#8b5cf6]" strokeWidth={2.5} />
                    <span className="font-bold text-xl text-[#8b5cf6]">Lofix</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Create your Lofix account</h1>
                <p className="text-sm text-gray-500 mt-1">Enter your details to get started.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Server Error Message Display */}
                {serverError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-xs font-medium animate-in fade-in zoom-in duration-200">
                        {serverError}
                    </div>
                )}

                <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-gray-700">Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            {...register("name")}
                            placeholder="Enter your name"
                            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border bg-white text-gray-900 outline-none transition-all ${
                                errors.name ? "border-red-500" : "border-gray-200 focus:border-[#8b5cf6]"
                            }`}
                        />
                    </div>
                    {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>

                <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-gray-700">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            {...register("email")}
                            type="email"
                            placeholder="name@example.com"
                            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border bg-white text-gray-900 outline-none transition-all ${
                                errors.email ? "border-red-500" : "border-gray-200 focus:border-[#8b5cf6]"
                            }`}
                        />
                    </div>
                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>

                <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-gray-700">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            {...register("password")}
                            type="password"
                            placeholder="Enter your password"
                            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border bg-white text-gray-900 outline-none transition-all ${
                                errors.password ? "border-red-500" : "border-gray-200 focus:border-[#8b5cf6]"
                            }`}
                        />
                    </div>
                    <p className="text-[10px] text-gray-400">Enter a password</p>
                    {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                </div>

                <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-gray-700">Confirm Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            {...register("confirmPassword")}
                            type="password"
                            placeholder="Confirm your password"
                            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border bg-white text-gray-900 outline-none transition-all ${
                                errors.confirmPassword ? "border-red-500" : "border-gray-200 focus:border-[#8b5cf6]"
                            }`}
                        />
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
                </div>

                <div className="flex items-center gap-2">
                    <input type="checkbox" required className="w-4 h-4 accent-[#8b5cf6] border-gray-300 rounded" />
                    <span className="text-[11px] text-gray-500">
                        I agree to the <Link href="#" className="text-[#8b5cf6] hover:underline">Terms and Conditions</Link>
                    </span>
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isPending ? "Creating account..." : "Create account"}
                </button>
            </form>

            <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-100"></div>
                <span className="flex-shrink mx-4 text-[10px] text-gray-400">Or continue with</span>
                <div className="flex-grow border-t border-gray-100"></div>
            </div>

            <div className="text-center">
                <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link href="/login" className="text-[#8b5cf6] font-bold hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}