"use client"

import { useRouter } from "next/navigation";
import { createClient } from "../../../../utils/supabase/client";
import { useCallback, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { TopNav } from "@/app/_components/topnav";
import Image from "next/image";



export default function PrintPage() {
    const router = useRouter();
    const supabaseClient = createClient();

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [hasImage, setHasImage] = useState<boolean>(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);

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
    const checkImage = useCallback(async () => {
        const { data, error } = await supabaseClient.from('profiles').select('image').eq('id', currentUser?.id).single();
        if (error) {
          console.error('Error fetching image', error);
        }
        if (data?.image !== null) {
          setHasImage(true);
          setProfileImage(data?.image);
        }
      }, [currentUser, supabaseClient]);


      useEffect(() => {
        if (currentUser) {
          checkImage();
        }
      }, [currentUser, checkImage]);

    
    if (!currentUser) {
        return <div>Loading...</div>
    }
    return (
        <>
        <TopNav />
        <div className="min-w-screen flex flex-col gap-4 justify-center items-center h-full mt-10">
                <h1 className="sm:text-xl text-lg font-semibold">Dashboard</h1>
                <h2>Logged in as: {currentUser?.user_metadata.first_name} {currentUser?.user_metadata.last_name}</h2>
                <Image alt="Loading profile image..." src={profileImage || ''} width={100} height={100} />
        </div>
        </>
    )
}