"use server"
import { register, login, whoAmI, updateProfile } from "../api/auth"
import { LoginValue, RegisterData } from "@/app/(auth)/schema";
import { setAuthToken , setUserData, clearAuthCookies } from "../cookie";
import {redirect} from "next/navigation";
import { set } from "zod";
import { revalidatePath } from "next/cache";



export const handleRegister = async (formData : RegisterData) =>{


    try {
        const result = await register(formData);

            if(result.success){
                return {
                    success : true, 
                    message : 'Registration Successful',
                    data : result.data
                };
            }

            return {
                success : false, 
                message : result.message || "Registration Failed"
            }
    }catch (err: Error | any){
        return {
            success: false, message : err.message || "Registration Failed "
        }
    }
}




export const handleLogin = async (formData : any) =>{


    try {
        const result = await login(formData);

            if(result.success){
                await setAuthToken(result.token);
                await setUserData(result.data);
                return {
                    success : true, 
                    message : 'Login Successful',
                    data : result.data
                };
            }

            return {
                success : false, 
                message : result.message || "Login Failed"
            }
    }catch (err: Error | any){
        return {
            success: false, message : err.message || "Login Failed "
        }
    }
}

export const handleLogout = async () => {
    await clearAuthCookies();
    return redirect('/login');
}


export async function handleWhoAmI() {
    try {
        const result = await whoAmI();
        if (result.success) {
            return {
                success: true,
                message: 'User data fetched successfully',
                data: result.data
            };
        }
        return { success: false, message: result.message || 'Failed to fetch user data' };
    } catch (error: Error | any) {
        return { success: false, message: error.message };
    }
}

export async function handleUpdateProfile(profileData: FormData) {
    try {
        const result = await updateProfile(profileData);
        if (result.success) {
            await setUserData(result.data); // update cookie 
            revalidatePath('/user/profile'); // revalidate profile page/ refresh new data
            return {
                success: true,
                message: 'Profile updated successfully',
                data: result.data
            };
        }
        return { success: false, message: result.message || 'Failed to update profile' };
    } catch (error: Error | any) {
        return { success: false, message: error.message };
    }
}