"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import { handleDeleteUser } from "@/lib/actions/admin/user_action";
import DeleteModal from "@/app/_components/DeleteModal";

const UserTable = ({ users = [], pagination, search }: { users: any[], pagination: any, search?: string }) => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState(search || '');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const currentPage = pagination?.page || 1;
    const totalPages = pagination?.totalPages || 1;
    const pageSize = pagination?.size || 10;

    // Safety check for Base URL
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const handleSearchChange = () => {
        router.push(`/admin/users?page=1&size=${pageSize}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}`);
    };

    const makePagination = (): React.ReactElement[] => {
        if (!pagination || totalPages <= 1) return [];
        const pages = [];
        const delta = 2;
        const getUrl = (p: number) => `/admin/users?page=${p}&size=${pageSize}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}`;

        pages.push(
            <Link key="prev" href={currentPage === 1 ? "#" : getUrl(currentPage - 1)}
                className={`px-3 py-1 border rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 pointer-events-none' : 'bg-white text-blue-500 hover:bg-blue-50'}`}>
                Previous
            </Link>
        );

        for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
            pages.push(
                <Link key={i} href={getUrl(i)}
                    className={`px-3 py-1 border rounded-md ${i === currentPage ? 'bg-blue-600 text-white' : 'bg-white text-blue-500 hover:bg-blue-50'}`}>
                    {i}
                </Link>
            );
        }

        pages.push(
            <Link key="next" href={currentPage === totalPages ? "#" : getUrl(currentPage + 1)}
                className={`px-3 py-1 border rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 pointer-events-none' : 'bg-white text-blue-500 hover:bg-blue-50'}`}>
                Next
            </Link>
        );
        return pages;
    };

    const onDelete = async () => {
        if (!deleteId) return;
        try {
            await handleDeleteUser(deleteId);
            toast.success("User deleted successfully");
            router.refresh();
        } catch (err: any) {
            toast.error(err.message || "Failed to delete user");
        } finally {
            setDeleteId(null);
        }
    };

    return (
        <div className="overflow-hidden">
            <DeleteModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={onDelete}
                title="Delete User"
                description="Are you sure? This will permanently remove the user."
            />

            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 flex gap-2 border-b dark:border-gray-700">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchChange()}
                    placeholder="Search by name or email..."
                    className="max-w-xs px-4 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={handleSearchChange} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                    Search
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 dark:bg-gray-800 text-xs uppercase text-gray-500 font-semibold">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Avatar</th>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-700 text-sm">
                        {users.length > 0 ? users.map((user, idx) => {
                            // Determine the final image source
                            const imageSrc = (user?.profilePicture && baseUrl) 
                                ? `${baseUrl}${user.profilePicture}` 
                                : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=random`;

                            return (
                                <tr key={user?._id || idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-gray-400">
                                        {user?._id ? user._id.toString().substring(0, 8) : "N/A"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="relative w-8 h-8">
                                            <Image
                                                src={imageSrc}
                                                alt="Avatar"
                                                fill
                                                sizes="32px"
                                                className="rounded-full object-cover bg-gray-200"
                                                unoptimized // Prevents errors if domain isn't in next.config.js
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                                        {user?.name || "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                        {user?.email || "N/A"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${
                                            user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                            {user?.role || "User"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-4">
                                        <Link href={`/admin/users/${user?._id}/edit`} className="text-blue-600 hover:text-blue-800 font-medium">Edit</Link>
                                        <button onClick={() => user?._id && setDeleteId(user._id)} className="text-red-500 hover:text-red-700 font-medium">Delete</button>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">No users found in database.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center border-t dark:border-gray-700">
                <span className="text-xs text-gray-500 font-medium">Page {currentPage} of {totalPages}</span>
                <div className="flex gap-1">{makePagination()}</div>
            </div>
        </div>
    );
};

export default UserTable;