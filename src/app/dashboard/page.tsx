// "use client";
"use client";
import { Button } from "@/components/ui/button";
import { checkImage } from "@/server/actions";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";

import { TopNav } from "../_components/topnav";
// import * as rdd from 'react-device-detect';

import { Input } from "@/components/ui/input";
// // import { updateImage } from "./actions";
import Image from "next/image";
import { Session } from "next-auth";

// function CameraComponent({user, onImageUpload}: {user: User, onImageUpload: () => void}) {
//     const isMobile = window.innerWidth < 768;
//     const width = isMobile ? 400 : 300;
//     const height = isMobile ? 300: 400;
//     console.log("mobile: ", isMobile)
//     const videoConstraints = {
//       width: width,
//       height: height,
//       facingMode: "user",
//     };

//     return (
//         <div className="flex flex-col items-center justify-center gap-4">
//         <div>
//             Welcome, {user.user_metadata.first_name} {user.user_metadata.last_name}
//         </div>

//         {!url && (
//             <>
//                     <div className="flex flex-row gap-4">
//             <Button onClick={() => {
//                 if (isCaptureEnable) {
//                     setCaptureEnable(false);
//                     setUrl(null);
//                 }
//                 else {
//                     setCaptureEnable(true);
//                 }
//             }}>{isCaptureEnable ? "Close Camera" : "Open Camera"} </Button>
//             {isCaptureEnable && <Button onClick={capture}>Capture</Button>}
//             </div>
//             </>
//         )}

//         {isCaptureEnable && (
//             <>
//             <Webcam
//                 audio={false}
//                 ref={webcamRef}
//                 screenshotFormat="image/jpeg"
//                 videoConstraints={videoConstraints}
//                 mirrored={true}
//             />
//             </>
//         )}

//             {url && (
//                 <>

//                 <div className="flex flex-row justify-center w-full gap-4">
//                     <Button onClick={() => {setUrl(null)}} className="w-fit">Delete</Button>
//                     <form action={async (formData) => {
//                         await updateImage(formData);
//                         onImageUpload();
//                     }}>
//                         <input name="image" defaultValue={url} hidden value={url} />
//                     <Button className="w-fit" type="submit">Upload Image</Button>
//                     </form>
//                 </div>
//                 <img src={url} alt="captured" />
//                 </>

//                 )}
//         </div>
//     )
// }

// export default function Dashboard() {

//     const router = useRouter();

//     const [currentUser, setCurrentUser] = useState<User | null>(null);
//     const [hasImage, setHasImage] = useState<boolean>(false);

//     const handleImageUpload = useCallback(() => {
//         setHasImage(true);
//         // checkImage();
//       }, []);

//     // const checkImage = useCallback(async () => {
//     //     const { data, error } = await supabaseClient.from('profiles').select('image').eq('id', currentUser?.id).single();
//     //     if (error) {
//     //       console.error('Error fetching image', error);
//     //     }
//     //     if (data?.image !== null) {
//     //       setHasImage(true);
//     //       router.push('/dashboard/print');
//     //     }
//     //   }, [currentUser, supabaseClient]);

//     //   useEffect(() => {
//     //     if (currentUser) {
//     //       checkImage();
//     //     }
//     //   }, [currentUser, checkImage]);

//     if (!currentUser) {
//         return <div>Loading...</div>
//     }
//     if (!hasImage) {
//         return (
//             <>
//             <TopNav />
//             <div className="min-w-screen flex flex-col gap-4 justify-center items-center h-full mt-10">
//             <CameraComponent user={currentUser} onImageUpload={handleImageUpload} />
//             </div>
//         </>
//         )
//     }

// }

function CameraComponent({session}: {session: Session | null}) {
  const isMobile = window.innerWidth < 768;
  const width = 300;
  const height = 400;
  console.log("mobile: ", isMobile);
  const videoConstraints = {
    width: width,
    height: height,
    facingMode: "user",
  };
  const [isCaptureEnable, setCaptureEnable] = useState<boolean>(false);
  const webcamRef = useRef<Webcam>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot({
      width: width,
      height: height,
    });
    if (imageSrc) {
      setUrl(imageSrc);
      console.log(imageSrc);

      setCaptureEnable(false);
      console.log(imageSrc);
    }
  }, [webcamRef, setUrl]);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
        <div>
            Welcome, {session?.user?.firstname} {session?.user?.lastname}
        </div>
        {!url && (
            <>
                <div className="flex flex-row gap-4">
                    <Button onClick={() => {
                        if (isCaptureEnable) {
                            setCaptureEnable(false);
                            setUrl(null);
                        }
                        else {
                            setCaptureEnable(true);
                        }
                    }}>{isCaptureEnable ? "Close Camera" : "Open Camera"} </Button>
                    {isCaptureEnable && <Button onClick={capture}>Capture</Button>}
                </div>
            </>
        )}
        {isCaptureEnable && (
            <>
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    mirrored={true}
                />
            </>
        )}
        {url && (
            <>
                <div className="flex flex-row justify-center w-full gap-4">
                    <Button onClick={() => {setUrl(null)}} className="w-fit">Delete</Button>
                    <form action={async (formData) => {
                        
                    }}>
                        <input name="image" defaultValue={url} hidden />
                        <Button className="w-fit" type="submit">Upload Image</Button>
                    </form>
                </div>
                <img src={url} alt="captured" />
            </>
        )}
    </div>
  );
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [imageStatus, setImageStatus] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const getImageStatus = async () => {
      if (session?.user?.id) {
        const result = await checkImage(session.user.id);
        setImageStatus(result);
      }
    };
    getImageStatus();
  }, [session?.user.image]);

  if (status === "loading") {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }
  if (!session) {
    router.push("/sign-up");
  }

  return (
<div>
    <TopNav />
    <div className="min-w-screen flex flex-col gap-4 justify-center items-center h-full mt-10">
        <CameraComponent session={session} />
    </div>
</div>
  );
}
