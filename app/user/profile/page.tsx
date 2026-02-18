import { handleWhoAmI } from "@/lib/actions/auth-action";
import { getUserData } from "@/lib/cookie";
import { notFound } from "next/navigation";
import UpdateUserForm from "./_components/UpdateForm";

export default async function Page() {
    let userData = null;
    
    // Try to get fresh data from API first
    try {
        const result = await handleWhoAmI();
        if (result.success && result.data) {
            userData = result.data;
        }
    } catch (error) {
        console.log("API call failed, using cached data");
    }
    
    // Fallback to cached data if API fails
    if (!userData) {
        userData = await getUserData();
    }

    if (!userData) {
        notFound();
    }

    return (
        <div className="py-6">
            <UpdateUserForm user={userData} />
        </div>
    );
}