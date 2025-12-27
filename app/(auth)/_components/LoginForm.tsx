"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Headphones } from "lucide-react";
import { loginSchema, type LoginValue } from "../schema";

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValue>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginValue) => {
    try {
      console.log("Login Data:", data);
      

      await new Promise((resolve) => setTimeout(resolve, 1000));


      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="w-full space-y-8">

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        <div className="space-y-1.5">
          <label className="text-[13px] font-semibold text-gray-700">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              {...register("email")}
              type="email"
              placeholder="name@example.com"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white text-gray-900 outline-none transition-all focus:ring-4 focus:ring-purple-500/10 ${
                errors.email ? "border-red-500" : "border-gray-200 focus:border-[#8b5cf6]"
              }`}
            />
          </div>
          {errors.email && <p className="text-[11px] text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-[13px] font-semibold text-gray-700">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              {...register("password")}
              type="password"
              placeholder="Enter your password"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white text-gray-900 outline-none transition-all focus:ring-4 focus:ring-purple-500/10 ${
                errors.password ? "border-red-500" : "border-gray-200 focus:border-[#8b5cf6]"
              }`}
            />
          </div>
          {errors.password && <p className="text-[11px] text-red-500">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded border-gray-300 accent-[#8b5cf6] cursor-pointer" 
            />
            <span className="text-[13px] text-gray-500 group-hover:text-gray-700">Remember me</span>
          </label>
          <Link href="#" className="text-[13px] text-[#8b5cf6] font-semibold hover:underline">
            Forgot password?
          </Link>
        </div>


        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-100 active:scale-[0.98] disabled:opacity-70"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>


      <div className="pt-6 text-center border-t border-gray-100">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link 
            href="/register" 
            className="text-[#8b5cf6] font-bold hover:text-[#7c3aed] transition-colors"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}