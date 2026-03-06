"use client";

import { Controller, useForm } from "react-hook-form";
import { UserData, UserSchema } from "@/app/admin/users/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { toast } from "react-toastify";
import { Camera, X, User, Mail, Lock, UserPlus, Loader2 } from "lucide-react";
import { handleCreateUser } from "@/lib/actions/admin/user_action";

export default function CreateUserForm() {
    const [pending, startTransition] = useTransition();
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<UserData>({
        resolver: zodResolver(UserSchema)
    });
    const [error, setError] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (file: File | undefined, onChange: (file: File | undefined) => void) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
        onChange(file);
    };

    const handleDismissImage = (onChange?: (file: File | undefined) => void) => {
        setPreviewImage(null);
        onChange?.(undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const onSubmit = async (data: UserData) => {
        setError(null);
        startTransition(async () => {
            try {
                const formData = new FormData();
                if (data.name) formData.append("name", data.name);
                formData.append("email", data.email);
                formData.append("password", data.password);
                formData.append("confirmPassword", data.confirmPassword);
                if (data.profilePicture) formData.append("profilePicture", data.profilePicture);

                const response = await handleCreateUser(formData);

                if (!response.success) {
                    throw new Error(response.message || "Failed to create account");
                }

                toast.success("Account created successfully");
                reset();
                handleDismissImage();
            } catch (err: any) {
                const msg = err.message || "An unexpected error occurred";
                toast.error(msg);
                setError(msg);
            }
        });
    };

    return (
        <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="max-w-2xl mx-auto bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden"
        >
            {/* Form Header */}
            <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/50">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <UserPlus size={20} className="text-blue-600" />
                    New User Registration
                </h2>
                <p className="text-sm text-slate-500">Provide account details and access permissions</p>
            </div>

            <div className="p-8 space-y-8">
                {/* Avatar Upload */}
                <div className="flex flex-col items-center justify-center">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-sm flex items-center justify-center overflow-hidden group transition-all hover:border-blue-50">
                            {previewImage ? (
                                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-10 h-10 text-slate-300" />
                            )}
                        </div>
                        
                        <Controller
                            name="profilePicture"
                            control={control}
                            render={({ field: { onChange } }) => (
                                <>
                                    {previewImage ? (
                                        <button
                                            type="button"
                                            onClick={() => handleDismissImage(onChange)}
                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    ) : (
                                        <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer shadow-lg hover:bg-blue-700 transition-colors border-2 border-white">
                                            <Camera className="w-4 h-4" />
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                className="hidden"
                                                onChange={(e) => handleImageChange(e.target.files?.[0], onChange)}
                                                accept=".jpg,.jpeg,.png,.webp"
                                            />
                                        </label>
                                    )}
                                </>
                            )}
                        />
                    </div>
                    {errors.profilePicture && (
                        <p className="text-[11px] text-red-500 mt-2 font-bold uppercase tracking-tight">
                            {errors.profilePicture.message}
                        </p>
                    )}
                </div>

                {/* Input Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                {...register("name")}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm font-medium"
                                placeholder="John Doe"
                            />
                        </div>
                        {errors.name && <p className="text-[11px] text-red-500 font-medium ml-1">{errors.name.message}</p>}
                    </div>

                    <div className="md:col-span-2 space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                {...register("email")}
                                type="email"
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm font-medium"
                                placeholder="john@example.com"
                            />
                        </div>
                        {errors.email && <p className="text-[11px] text-red-500 font-medium ml-1">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                {...register("password")}
                                type="password"
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm font-medium"
                                placeholder="••••••••"
                            />
                        </div>
                        {errors.password && <p className="text-[11px] text-red-500 font-medium ml-1">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                {...register("confirmPassword")}
                                type="password"
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm font-medium"
                                placeholder="••••••••"
                            />
                        </div>
                        {errors.confirmPassword && <p className="text-[11px] text-red-500 font-medium ml-1">{errors.confirmPassword.message}</p>}
                    </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={pending}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-100 active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-3"
                    >
                        {pending ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Verifying...</span>
                            </>
                        ) : (
                            <>
                                <UserPlus size={18} />
                                <span>Create Account</span>
                            </>
                        )}
                    </button>
                    
                    {error && (
                        <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[11px] font-bold text-center uppercase tracking-tighter">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
}