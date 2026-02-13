import Link from "next/link";
import { handleGetAllUsers } from "@/lib/actions/admin/user_action";
import UserTable from "./_components/UserTable";

export default async function Page({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const page = (params.page as string) || '1';
    const size = (params.size as string) || '10';
    const search = (params.search as string) || '';

    const response = await handleGetAllUsers(page, size, search);

    if (!response.success) {
        throw new Error(response.message || 'Failed to load users');
    }

    // FINAL SAFETY CHECK: Grab the array even if it's nested in response.data.user
    const rawData = response.data;
    const safeUsers = Array.isArray(rawData) 
        ? rawData 
        : (rawData && typeof rawData === 'object' && 'user' in rawData) 
            ? (rawData as any).user 
            : [];

    console.log(`DEBUG: Users to be rendered: ${safeUsers.length}`);

    const safePagination = response.pagination || {
        page: parseInt(page),
        totalPages: 1,
        totalItems: safeUsers.length,
        size: parseInt(size)
    };

    return (
        <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">User Management</h1>
                        <p className="text-sm text-gray-500">Manage your system users</p>
                    </div>
                    <Link 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 shadow-sm"
                        href="/admin/users/create"
                    >
                        Create User
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 border rounded-xl shadow-sm overflow-hidden">
                    <UserTable 
                        users={safeUsers} 
                        pagination={safePagination} 
                        search={search} 
                    />
                </div>
            </div>
        </div>
    );
}