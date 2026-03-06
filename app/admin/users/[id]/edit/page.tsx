"use client";
import { useEffect, useState } from "react";
import { getUserById } from "@/lib/api/admin/user";
import UpdateUserForm from "../../_components/UpdateUserForm";

export default function Page({
    params
}: {
    params: Promise<{ id: string }>;
}) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { id } = await params;
                const response = await getUserById(id);
                
                if (response.success) {
                    setUser(response.data);
                } else {
                    setError(response.message || 'Failed to load user');
                }
            } catch (err: any) {
                setError(err.message || 'Failed to load user');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [params]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <UpdateUserForm user={user} />
        </div>
    );
}