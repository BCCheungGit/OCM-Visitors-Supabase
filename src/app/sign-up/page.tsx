"use client"


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUp, verifyOtp } from "./actions";
import { useState } from "react";

export default function SignUpPage() {

    const [otpSent, setOtpSent] = useState<boolean>(false);



    return (
        <div className="min-w-screen flex flex-row justify-center items-center h-full">
            <div className="w-fit flex mt-10 flex-col items-center border-2 p-4 gap-4 rounded-lg shadow-xl">
                <h1 className="sm:text-xl text-lg font-semibold">Sign Up</h1>
                <form className="flex flex-col gap-4" action={async (formData) => {
                    if (otpSent) {
                        console.log('verifying otp')
                        await verifyOtp(formData);
                    } else {
                        try {
                            console.log('signing up')
                            
                            const result = await signUp(formData);
                            console.log(result);
                            
                            if (result.message) {
                                setOtpSent(true);
                            }
                        } catch (error) {
                            console.error(error)
                        }
                    }
                }}>
                    <div className="flex flex-row gap-4" >
                        <div className="flex flex-col">
                            <label htmlFor="first-name" className="sm:text-base text-sm" aria-required>First Name</label>
                            <Input type="text" name="first-name" />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="last-name" className="sm:text-base text-sm" aria-required>Last Name</label>
                            <Input type="text" name="last-name" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="phone" className="sm:text-base text-sm" aria-required>Phone Number</label>
                        <Input type="text" name="phone" />
                    </div>
                    <Button type="submit">Sign Up</Button>
                    {otpSent && (
                        <div className="flex flex-col gap-4">
                            <div>
                                <label htmlFor="otp" className="sm:text-base text-sm">OTP</label>
                                <Input type="text" name="otp" />
                            </div>
                            <Button type="submit">Verify</Button>
                        </div>
                    )}

                </form>
            </div>
        </div>
    )
}

