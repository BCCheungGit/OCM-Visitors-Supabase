"use client";

import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { createClient } from "../../../utils/supabase/client";
import { redirect, useRouter } from "next/navigation";
import { is_claims_admin } from "@/server/claims/claims";
import { TopNav } from "../_components/topnav";



export default function AdminPage() {
    const supabase = createClient();
    const router = useRouter();

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    useEffect(() => {
        async function checkUser() {
            const { data: { user } } = await supabase.auth.getUser();
            const result = await is_claims_admin();
            setIsAdmin(result);
            
            if (result === false) {
                router.push("/dashboard/print");
            }
            
            if (user) {
                setCurrentUser(user);
            } else {
                router.push("/");
            }
            

        }

        checkUser();
    }, [supabase, router])

    if (!currentUser || isAdmin === null) {
        return <div>Loading...</div>
    }
    return (
            <>
            <TopNav />
            <div>
            <h1>You are an Admin: {isAdmin !== null ? isAdmin.toString() : 'Loading...'}</h1>
    </div>
        
        </>
        )

}