import axios from "./axios";
import { LoginValue, RegisterData } from "@/app/(auth)/schema";
import {API} from "./endpoints";


export const register = async (registerData: RegisterData)=>{
    try {
        const response = await axios.post(
            API.AUTH.REGISTER, 
            registerData
        );
        return response.data; 
    }catch (err: Error | any){
        throw new Error (
            err.response?.data?.message
            || err.message
            || 'Registration Failed'
        );
    }
}


export const login = async (loginData: LoginValue)=>{
    try {
        const response = await axios.post(
            API.AUTH.LOGIN, 
            loginData
        );
        return response.data; 
    }catch (err: Error | any){
        throw new Error (
            err.response?.data?.message
            || err.message
            || 'Login Failed'
        );
    }
}
