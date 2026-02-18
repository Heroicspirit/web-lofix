"use client";

import { Controller, useForm } from "react-hook-form";
import { UserData, UserSchema } from "@/app/admin/users/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { toast } from "react-toastify";
import { Camera, X, User, Mail, Lock } from "lucide-react";
import { handleCreateUser } from "@/lib/actions/admin/user_action";

export default function CreateUserForm() {
    const [pending, startTransition] = useTransition();
    const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<UserData>({
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
                    throw new Error(response.message || "Create New Account failed");
                }

                toast.success("New Account created successfully");
                reset();
                handleDismissImage();
            } catch (error: any) {
                toast.error(error.message || "Create New Account failed");
                setError(error.message || "Create New Account failed");
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl mx-auto space-y-6 p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
            
            {/* Header Section */}
            <div className="text-center space-y-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New User</h2>
                <p className="text-sm text-gray-500">Fill in the details to add a new member</p>
            </div>

            {/* Profile Image Upload Section */}
            <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative group">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-purple-50 dark:border-purple-900/20 bg-gray-50 dark:bg-zinc-800 flex items-center justify-center transition-all group-hover:border-purple-100">
                        {previewImage ? (
                            <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <Camera className="w-8 h-8 text-gray-400" />
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
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <label className="absolute bottom-0 right-0 bg-purple-600 text-white rounded-full p-2 cursor-pointer shadow-lg hover:bg-purple-700 transition-colors">
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
                {errors.profilePicture && <p className="text-xs text-red-500 font-medium">{errors.profilePicture.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name Field */}
                <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[13px] font-semibold text-gray-700 dark:text-gray-300">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            {...register("name")}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all text-sm"
                            placeholder="John Doe"
                        />
                    </div>
                    {errors.name && <p className="text-[11px] text-red-500 font-medium">{errors.name.message}</p>}
                </div>

                {/* Email Field */}
                <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[13px] font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            {...register("email")}
                            type="email"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all text-sm"
                            placeholder="john@example.com"
                        />
                    </div>
                    {errors.email && <p className="text-[11px] text-red-500 font-medium">{errors.email.message}</p>}
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-gray-700 dark:text-gray-300">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            {...register("password")}
                            type="password"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all text-sm"
                            placeholder="••••••"
                        />
                    </div>
                    {errors.password && <p className="text-[11px] text-red-500 font-medium">{errors.password.message}</p>}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-gray-700 dark:text-gray-300">Confirm Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            {...register("confirmPassword")}
                            type="password"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all text-sm"
                            placeholder="••••••"
                        />
                    </div>
                    {errors.confirmPassword && <p className="text-[11px] text-red-500 font-medium">{errors.confirmPassword.message}</p>}
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting || pending}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-purple-200 dark:shadow-none active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
            >
                {isSubmitting || pending ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Creating User...</span>
                    </>
                ) : (
                    "Create User Account"
                )}
            </button>

            {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-red-600 dark:text-red-400 text-xs font-medium text-center">
                    {error}
                </div>
            )}
        </form>
    );
}