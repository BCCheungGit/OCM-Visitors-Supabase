"use client"

import { useRouter } from "next/navigation";
import { createClient } from "../../../../utils/supabase/client";
import { useCallback, useEffect, useRef, useState } from "react";
import { User } from "@supabase/supabase-js";
import { TopNav } from "@/app/_components/topnav";
import Image from "next/image";
import { IDCard } from "./_components/idcard";
import ReactToPrint from 'react-to-print';
import { Button } from "@/components/ui/button";

function convertToESTFormat(dateString: string): string {

  const date = new Date(dateString);
  
  return date.toLocaleTimeString("en-US", {
    year: "numeric",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })

}

interface CardProps {
  user: User;
  idCardContainerRef: React.RefObject<HTMLDivElement>;
  photo: string | undefined;
}

const CardComponent: React.FC<CardProps> = ({user, idCardContainerRef, photo}) => {
  return (
    <div ref={idCardContainerRef}>
      <IDCard
        name={`${user.user_metadata.first_name} ${user.user_metadata.last_name}`}
        phone={user.user_metadata.phone_number}
        photo={photo}
        date={convertToESTFormat(user.user_metadata.sign_in_time)}
      />
    </div>
  )
}

export default function PrintPage() {
    const router = useRouter();
    const supabaseClient = createClient();

    const idCardContainerRef = useRef<HTMLDivElement>(null);

    const [currentUser, setCurrentUser] = useState<User | null>(null);
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
                <div className="sm:inline hidden">
                  <ReactToPrint 
                    trigger={() => <Button>Print ID Card</Button>}
                    content={() => idCardContainerRef.current}
                  />

                </div>
                <CardComponent user={currentUser} idCardContainerRef={idCardContainerRef} photo={profileImage || ''} />
        </div>
        </>
    )
}