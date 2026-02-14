"use server";
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from "@/lib/api/admin/user";
import { revalidatePath } from 'next/cache';

export const handleCreateUser = async (data: FormData) => {
    try {
        const response = await createUser(data)
        if (response.success) {
            revalidatePath('/admin/users');
            return {
                success: true,
                message: 'Registration successful',
                data: response.data
            }
        }
        return {
            success: false,
            message: response.message || 'Registration failed'
        }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Registration action failed' }
    }
}
export const handleGetAllUsers = async (
    page: string, size: string, search?: string
) => {
    try {
        const currentPage = parseInt(page) || 1;
        const currentSize = parseInt(size) || 10;

        const response = await getAllUsers(currentPage, currentSize, search);
        console.log('DEBUG: Full API response:', JSON.stringify(response, null, 2));
        if (response.success) {
            return {
                success: true,
                message: 'Get all users successful',
                data: response.data,
                pagination: response.data?.pagination
            }
        }
        return {
            success: false,
            message: response.message || 'Get all users failed'
        }
    } catch (error: Error | any) {
        return {
            success: false,
            message: error.message || 'Get all users action failed'
        }
    }
}
export const handleGetOneUser = async (id: string) => {
    try {
        const response = await getUserById(id);
        if (response.success) {
            return {
                success: true,
                message: 'Get user by id successful',
                data: response.data
            }
        }
        return {
            success: false,
            message: response.message || 'Get user by id failed'
        }
    } catch (error: Error | any) {
        return {
            success: false,
            message: error.message || 'Get user by id action failed'
        }
    }
}

export const handleUpdateUser = async (id: string, data: FormData) => {
    try {
        // Debug: Log FormData contents received
        console.log('Server: FormData received for user update:', id);
        for (let [key, value] of data.entries()) {
            console.log(key, value instanceof File ? `File: ${value.name}, ${value.size} bytes, ${value.type}` : value);
        }
        
        const response = await updateUser(id, data)
        console.log('Backend API response:', JSON.stringify(response, null, 2))
        if (response.success) {
            revalidatePath('/admin/users');
            return {
                success: true,
                message: 'Update user successful',
                data: response.data
            }
        }
        return {
            success: false,
            message: response.message || 'Update user failed'
        }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Update user action failed' }
    }
}

export const handleDeleteUser = async (id: string) => {
    try {
        const response = await deleteUser(id)
        if (response.success) {
            revalidatePath('/admin/users');
            return {
                success: true,
                message: 'Delete user successful'
            }
        }
        return {
            success: false,
            message: response.message || 'Delete user failed'
        }
    } catch (error: Error | any) {
        return { success: false, message: error.message || 'Delete user action failed' }
    }
}
        