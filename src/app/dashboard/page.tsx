"use client";


import { useEffect, useState } from "react";
import { createClient } from "../../../utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { TopNav } from "../_components/topnav";



export default function Dashboard() {

    const router = useRouter();
    const supabaseClient = createClient();


    
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    useEffect(() => {
        async function checkUser() {
            const { data: { user } } = await supabaseClient.auth.getUser();

            if (user) {
                setCurrentUser(user);

            } else {
                router.push("/");
            }
        }
        checkUser();
    }, [])


    return (
        <>
        <TopNav />
        <div className="min-w-screen flex flex-col gap-4 justify-center items-center h-full mt-10">
                <h1 className="sm:text-xl text-lg font-semibold">Dashboard</h1>
                <h2>Logged in as: {currentUser?.user_metadata.first_name} {currentUser?.user_metadata.last_name}</h2>
        </div>
    </>
    )
}