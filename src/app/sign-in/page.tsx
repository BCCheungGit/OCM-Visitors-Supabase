"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { use, useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Link from "next/link";

import { PhoneInput } from "@/components/ui/phoneinput";
import { TopNav } from "../_components/topnav";
import { signIn } from "next-auth/react";
import { createVerification } from "@/server/actions";

export default function SignInPage() {
  const router = useRouter();

  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [otpValue, setOtpValue] = useState<string>("");

  const { toast } = useToast();
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    const formData = new FormData(e.currentTarget);
    if (otpSent) {
      await handleSignUp();
    } else {
      await handleSubmit(formData);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    console.log("signing up");
    const phoneNumber = formData.get("phone") as string;
    const res = await createVerification(phoneNumber);
    if (typeof res === "object" && res.error) {
      toast({
        title: "Sign Up Error",
        description: res.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sent a code to: " + phoneNumber,
        description: "Please enter the code to verify your phone number.",
        variant: "default",
      });
      setOtpSent(true);
      setPhoneNumber(phoneNumber);
    }
  };

  const handleSignUp = async () => {
    console.log("verifying otp");

    const res = await signIn("credentials", {
        phoneNumber: phoneNumber,
        otpValue: otpValue,
    }) 
    console.log(res);
    if (typeof res === "object" && res.error) {
      toast({
        title: "Verification Error",
        description: res.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Phone Number Verified",
        description: "You have successfully verified your phone number.",
      });
      router.push("/dashboard");
    }
  };

  return (
    <>
      <TopNav />
      <div className="min-w-screen flex flex-row justify-center items-center h-full">
        <div className="w-fit flex mt-10 flex-col items-center border-2 p-8 gap-6 rounded-lg shadow-xl">
          <h1 className="sm:text-xl text-lg font-semibold">Sign In</h1>
          <form
            className="flex flex-col gap-4"
            action={async (formData) => {
              if (otpSent) {
                console.log("verifying otp");
              }
            }}
          >
            {!otpSent && (
              <div className="flex flex-col gap-6">
                <div>
                  <label
                    htmlFor="phone"
                    className="sm:text-sm text-xs"
                    aria-required
                  >
                    Phone Number 電話號碼
                  </label>
                  <PhoneInput
                    required
                    placeholder="Enter Phone Number"
                    name="phone"
                    value="+1"
                  />
                </div>
                <Button type="submit">Sign In</Button>
              </div>
            )}

            {otpSent && (
              <div className="flex flex-col gap-4">
                <div>
                  <Input type="hidden" name="phone" value={phoneNumber} />
                  <label htmlFor="otp" className="sm:text-base text-sm">
                    OTP
                  </label>
                  <InputOTP
                    required
                    name="otp"
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS}
                    value={otpValue}
                    onChange={(value) => setOtpValue(value)}
                  >
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
          <div className="p-2 border-2 rounded-lg shadow-lg h-full flex flex-row items-center justify-center gap-4 w-full">
            <p className="text-sm">First time? 新訪客？</p>
            <Link
              href="/sign-up"
              className="text-sm text-purple-700 hover:text-purple-100"
            >
              Sign Up 註冊
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
