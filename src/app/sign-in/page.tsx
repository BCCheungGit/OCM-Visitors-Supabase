"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
  } from "@/components/ui/input-otp"

import { REGEXP_ONLY_DIGITS } from "input-otp"
import { use, useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Link from "next/link";
import { createClient } from "../../../utils/supabase/client";
import * as RDNInput from 'react-phone-number-input';
import { signIn, verifyOtp } from "./actions";


export default function SignInPage() {


    const router = useRouter();

    const supabaseClient = createClient();

    useEffect(() => {
        async function checkUser() {
            const { data: { user } } = await supabaseClient.auth.getUser();

            if (user) {
                router.push("/dashboard");
            }
        }
        checkUser();
    }, [])

    const [otpSent, setOtpSent] = useState<boolean>(false);
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [otpValue, setOtpValue] = useState<string>("")

    const { toast } = useToast();

    return (
        <div className="min-w-screen flex flex-row justify-center items-center h-full">
            <div className="w-fit flex mt-10 flex-col items-center border-2 p-4 gap-4 rounded-lg shadow-xl">
                <h1 className="sm:text-xl text-lg font-semibold">Sign In</h1>
                <form className="flex flex-col gap-4" action={async (formData) => {
                    if (otpSent) {
                        console.log('verifying otp')
                        await verifyOtp(formData);
                    } else {
                        try {
                            console.log('signing up')
                            
                            const result = await signIn(formData);
                            console.log(result);

                            if (result.error && result.error === 'User does not exist. Please Sign Up') {  
                                toast({
                                    title: "Sign In Error",
                                    description: 'User does not exist. Please Sign Up',
                                    variant: "destructive",
                                    action: <Link href="/sign-up"><ToastAction altText="Sign Up">Sign Up</ToastAction></Link>
                                });
                            
                            }

                            if (result.message) {
                                toast({
                                    title: "Sent a code to: " + formData.get('phone'),
                                    description: "Please enter the code to verify your phone number.",
                                    variant: "default",
                                    
                                }       
                                )

                                setPhoneNumber(formData.get('phone') as string);
                                setOtpSent(true);
                            }
                        } catch (error) {
                            console.error(error)
                            toast({
                                title: "Sign Up Error",
                                description: "An error occurred. Please try again.",
                                variant: "destructive",
                            });
                        }
                    }
                }}>
 {!otpSent && (
                <div className="flex flex-col gap-6">
            <div>
                <label htmlFor="phone" className="sm:text-base text-sm" aria-required>Phone Number</label>
                <Input type="text" name="phone" />
            </div>
            <Button type="submit">Sign In</Button>
            </div>
                )}



                    {otpSent && (
                        <div className="flex flex-col gap-4">
                            <div>
                                <Input type="hidden" name="phone" value={phoneNumber} />
                                <label htmlFor="otp" className="sm:text-base text-sm">OTP</label>
                                <InputOTP name="otp" maxLength={6} pattern={REGEXP_ONLY_DIGITS} value={otpValue} onChange={(value) => setOtpValue(value)}>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                    </InputOTP>
                            </div>
                            <Button type="submit">Verify</Button>
                        </div>
                    )}

                </form>
            </div>
        </div>

    )
}