"use client";

import { useState, useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { z } from "zod";
import { handleUpdateProfile } from "@/lib/actions/auth-action";

// Create a simpler schema for profile updates
const ProfileUpdateSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
});

type ProfileUpdateData = z.infer<typeof ProfileUpdateSchema>;

export default function UpdateUserForm({ user }: { user: any }) {
    const [isPending, startTransition] = useTransition();
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Get the correct profile picture URL from backend
    const getProfilePictureUrl = (user: any) => {
        if (preview) return preview;
        
        const imageUrl = user.profilePicture || user.image;
        if (!imageUrl) return null;
        
        // If it's already a full URL, return as is
        if (imageUrl.startsWith('http')) {
            return imageUrl;
        }
        
        // If it's a relative path, construct the full URL
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
        
        // Handle different path formats
        if (imageUrl.startsWith('/uploads/')) {
            return `${baseUrl}${imageUrl}`;
        } else if (imageUrl.startsWith('/upload/')) {
            return `${baseUrl}${imageUrl}`;
        } else if (imageUrl.startsWith('/')) {
            return `${baseUrl}${imageUrl}`;
        } else {
            return `${baseUrl}/${imageUrl}`;
        }
    };

    const profilePictureUrl = getProfilePictureUrl(user);

    const { register, handleSubmit, formState: { errors } } = useForm<ProfileUpdateData>({
        resolver: zodResolver(ProfileUpdateSchema),
        defaultValues: {
            name: user.name || user.firstName || user.username || "",
            email: user.email || ""
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleDismissImage = () => {
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const onSubmit = async (data: ProfileUpdateData) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        const file = fileInputRef.current?.files?.[0];
        if (file) formData.append("image", file);

        startTransition(async () => {
            try {
                const res = await handleUpdateProfile(formData);
                if (res.success) {
                    toast.success("Profile updated successfully!");
                    handleDismissImage(); // Reset preview after successful update
                    // Force a page refresh to show the updated image from backend
                    window.location.reload();
                } else {
                    toast.error(res.message);
                }
            } catch (err) {
                toast.error("An error occurred during update.");
            }
        });
    };

    return (
        <div className="w-full">
            {/* 1. Hero Section - Atomu Style */}
            <div className="flex items-center gap-10 mb-10">
                <div 
                    className="relative h-40 w-40 rounded-full bg-gray-100 overflow-hidden border-8 border-white shadow-sm group cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {profilePictureUrl ? (
                        <img src={profilePictureUrl} className="h-full w-full object-cover" alt="Profile" />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center text-5xl text-gray-300"></div>
                    )}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-white font-bold text-xs">CHANGE</span>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <h1 className="text-5xl font-black text-gray-900">{user.name || user.firstName || user.username || "User"}</h1>
                    <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-5 py-2 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition shadow-sm"
                    >
                        <span>📝</span> Edit Profile
                    </button>
                </div>
            </div>

            {/* 2. Stats Bar - From Screenshot */}
            <div className="flex gap-16 mb-16 px-4">
                <div className="text-center">
                    <span className="block text-3xl font-black text-gray-800">12</span>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Playlists</span>
                </div>
                <div className="text-center">
                    <span className="block text-3xl font-black text-gray-800">345</span>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Liked Songs</span>
                </div>
            </div>

            {/* 3. Account Settings Form */}
            <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-8">
                    <span className="text-[#8B5CF6] text-xl">⚙️</span>
                    <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Navigation-style button matching image_068158.png */}
                    <div className="bg-white border border-gray-100 rounded-[1.5rem] p-5 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition shadow-sm mb-10">
                        <div className="flex items-center gap-4">
                            <span className="text-gray-400 text-lg">👤</span>
                            <span className="font-bold text-gray-700">Profile Settings</span>
                        </div>
                        <span className="text-gray-300 text-2xl font-light">›</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Name</label>
                            <input 
                                {...register("name")} 
                                className="w-full bg-[#F8F9FA] border-none rounded-2xl py-4 px-5 text-sm font-semibold outline-none focus:ring-2 focus:ring-purple-100" 
                            />
                            {errors.name && <p className="text-xs text-red-500 mt-1 pl-1">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-1">Email</label>
                            <input 
                                {...register("email")} 
                                disabled 
                                className="w-full bg-gray-100 border-none rounded-2xl py-4 px-5 text-sm font-semibold text-gray-400 cursor-not-allowed" 
                            />
                        </div>
                    </div>

                    <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />

                    <div className="flex justify-end pt-6">
                        <button 
                            type="submit" 
                            disabled={isPending}
                            className="bg-[#5c88f6] text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-sky-500 transition shadow-xl shadow-purple-100 disabled:opacity-50"
                        >
                            {isPending ? "SAVING..." : "UPDATE PROFILE"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}