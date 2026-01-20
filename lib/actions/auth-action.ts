"use server"


import { register, login } from "../api/auth"
import { LoginValue, RegisterData } from "@/app/(auth)/schema";
import { setAuthToken , setUserData, clearAuthCookies } from "../cookie";
import {redirect} from "next/navigation";
import { set } from "zod";



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