"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { createClient } from "../../../utils/supabase/client";
import { useState, useEffect, createContext } from 'react';
import { User } from '@supabase/supabase-js';
import { useRouter } from "next/navigation";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { ArrowDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";


export const TopNavContext = createContext<boolean>(false);

export function TopNav() {
    const supabaseClient = createClient();

    const [userExists, setUserExists] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function checkUser() {
            const { data: { user } } = await supabaseClient.auth.getUser();

            if (user) {
                setCurrentUser(user);
            }

        }
        checkUser();
    }, [])

    

    useEffect(() => {
        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                setUserExists(false)
            }
            if (event === "SIGNED_IN") {
                setUserExists(true)
            }
            if (session) {
                setUserExists(true)
            }
        }
        )
        return () => {
            subscription.unsubscribe()
        }
    }, [supabaseClient])


    return (
        <TopNavContext.Provider value={userExists}>

            <nav className="flex items-center justify-between w-full p-4 sm:text-xl text-base font-semibold border-b">
                <div className="flex items-center w-1/4">
                    <Image src='https://avatars.planningcenteronline.com/uploads/organization/217202-1482195203/avatar.1.png' alt="Main Church" className="sm:w-[120px] sm:h-[120px]" width={80} height={80} />
                </div>
                <div className="flex flex-col items-center justify-center w-2/4">
                    <h1 className="sm:text-2xl text-lg text-center">
                        <span className="sm:inline hidden">Oversea Chinese Mission 中華海外宣道會</span>
                        <span className="sm:hidden inline">OCM 中宣會</span>
                    </h1>
                    <h2 className="sm:text-xl text-base text-center mt-2">
                        <span className="sm:inline hidden">Visitor Registration 訪客登記</span>
                        <span className="sm:hidden inline">訪客登記</span>
                    </h2>

                </div>
                <div className="flex justify-end gap-4 items-center w-1/4">
                    {!userExists ?
                        (<div></div>) :
                        (
                            <>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button className="flex flex-row gap-1" variant="secondary">{currentUser?.user_metadata.first_name} <ArrowDown size={16} strokeWidth={1.5} /> </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="sm:w-80 w-60">
                                        <div className="grid gap-4">
                                            <div className="space-y-2">
                                                <h4 className="font-medium leading-none">Hello, {currentUser?.user_metadata.first_name} {currentUser?.user_metadata.last_name}!</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    你好，{currentUser?.user_metadata.first_name} {currentUser?.user_metadata.last_name}！
                                                </p>
                                            </div>
                                            <Button onClick={async () => {
                                    router.push("/")
                                    const { error } = await supabaseClient.auth.signOut();
                                    if (error) {
                                        console.error('Error signing out', error);
                                    } else {
                                        setUserExists(false);
                                    }

                                }}>
                                                Log Out
                                            </Button>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </>
                        )}
                </div>
            </nav>
        </TopNavContext.Provider>
    )
}