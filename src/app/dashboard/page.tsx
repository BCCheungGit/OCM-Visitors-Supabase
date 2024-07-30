"use client";


import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "../../../utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { TopNav } from "../_components/topnav";
import * as rdd from 'react-device-detect';
import Webcam from "react-webcam";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateImage } from "./actions";
import Image from "next/image";




function CameraComponent({ user }: { user: User }) {
    const isMobile = rdd.isMobile;
    const width = isMobile ? 400 : 300;
    const height = isMobile ? 300: 400;
    
    const videoConstraints = {
      width: width,
      height: height,
      facingMode: "user",
    };
    
    const [isCaptureEnable, setCaptureEnable] = useState<boolean>(false);
    const webcamRef = useRef<Webcam>(null);
    const [url, setUrl] = useState<string | null>(null);
    
    const capture = useCallback(() => {
      const imageSrc = webcamRef.current?.getScreenshot({width: isMobile ? height : width, height: isMobile ? width : height});
      if (imageSrc) {
        setUrl(imageSrc);
        console.log(imageSrc);
    
        setCaptureEnable(false);
        console.log(imageSrc);
      }
    }, [webcamRef]);



    
    return (
        <div className="flex flex-col items-center justify-center">
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                style={{width: isMobile ? height : width, height: isMobile ? width : height}}
            />
            <button onClick={capture}>Capture</button>
            {url && <img src={url} alt="captured" />}
        </div>
    )
}






export default function Dashboard() {

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

    useEffect(() => {
        async function checkImage() {
            const { data, error } = await supabaseClient.from('profiles').select('image').eq('id', currentUser?.id).single();

            if (data) {
                setHasImage(true);
                setProfileImage(data.image);
            }
        }
        if (currentUser) {
            checkImage();
        }
    }, [currentUser])


    if (!currentUser) {
        return <div>Loading...</div>
    }
    if (!hasImage) {
        return (
            <>
            <TopNav />
            <div className="min-w-screen flex flex-col gap-4 justify-center items-center h-full mt-10">
                    <h1 className="sm:text-xl text-lg font-semibold">Dashboard</h1>
                    <h2>Logged in as: {currentUser?.user_metadata.first_name} {currentUser?.user_metadata.last_name}</h2>
                    <form action={async (formData) => {
                        await updateImage(formData);
                    }
                    }>
                        
                        <Input type="text" placeholder="Enter base64 profile image" name="image" />
                        <Button type="submit">Upload</Button>
                    </form>
            </div>
        </>
        )
    }
    else {
        return (
            <>
            <TopNav />
            <div className="min-w-screen flex flex-col gap-4 justify-center items-center h-full mt-10">
                    <h1 className="sm:text-xl text-lg font-semibold">Dashboard</h1>
                    <h2>Logged in as: {currentUser?.user_metadata.first_name} {currentUser?.user_metadata.last_name}</h2>
                    <Image alt="profile image" src={profileImage || ''} width={100} height={100} />
            </div>
            </>
        )
    }

}