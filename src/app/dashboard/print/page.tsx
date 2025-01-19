"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { IDCard } from "./_components/idcard";
import ReactToPrint from "react-to-print";
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { checkImage } from "@/server/actions";

function convertToESTFormat(dateString: string): string {
  const date = new Date(dateString);

  return date.toLocaleTimeString("en-US", {
    year: "numeric",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface CardProps {
  session: Session | null;
  idCardContainerRef: React.RefObject<HTMLDivElement>;
  photo: string | undefined;
}

const CardComponent: React.FC<CardProps> = ({
  session,
  idCardContainerRef,
  photo,
}) => {
  return (
    <div ref={idCardContainerRef}>
      <IDCard
        id={session?.user.id}
        name={`${session?.user.firstname} ${session?.user.lastname}`}
        phone={session?.user.phone}
        photo={photo}
        date={
          session?.user.created_at
            ? convertToESTFormat(session.user.created_at)
            : ""
        }
      />
    </div>
  );
};

// export default function PrintPage() {
//     const router = useRouter();

//     const idCardContainerRef = useRef<HTMLDivElement>(null);

//     const [currentUser, setCurrentUser] = useState<User | null>(null);
//     const [profileImage, setProfileImage] = useState<string | null>(null);

//     const checkImage = useCallback(async () => {
//         const { data, error } = await supabaseClient.from('profiles').select('image').eq('id', currentUser?.id).single();
//         if (error) {
//           console.error('Error fetching image', error);
//         }
//         if (data?.image !== null) {
//           setProfileImage(data?.image);
//         }
//       }, [currentUser, supabaseClient]);

//       useEffect(() => {
//         if (currentUser) {
//           checkImage();
//         }
//       }, [currentUser, checkImage]);

//     if (!currentUser) {
//         return <div>Loading...</div>
//     }
//     return (
//         <>
//         <TopNav />
//         <div className="min-w-screen flex flex-col gap-4 justify-center items-center h-full mt-10">
//                 <div className="sm:inline hidden">
//                   <ReactToPrint
//                     trigger={() => <Button>Print ID Card</Button>}
//                     content={() => idCardContainerRef.current}
//                   />

//                 </div>
//                 <CardComponent user={currentUser} idCardContainerRef={idCardContainerRef} photo={profileImage || ''} />
//         </div>
//         </>
//     )
// }

export default function Print() {
  const { data: session, status } = useSession();

  const idCardContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
    const getImageStatus = async () => {
      if (session?.user.id) {
        const image = await checkImage(session?.user.id);
        if (!image) {
          router.push("/dashboard");
        }
      }
    };
    getImageStatus();
  }, [session, session?.user, session?.user.image]);

  return (
    <div>
      <div className="min-w-screen flex flex-col gap-4 justify-center items-center h-full mt-10">
        <div className="sm:inline hidden">
          <ReactToPrint
            trigger={() => <Button>Print ID Card</Button>}
            content={() => idCardContainerRef.current}
          />
        </div>
        <CardComponent
          session={session}
          idCardContainerRef={idCardContainerRef}
          photo={session?.user.image || ""}
        />
      </div>
    </div>
  );
}
