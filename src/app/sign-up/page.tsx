"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { use, useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Link from "next/link";

import { PhoneInput } from "../../components/ui/phoneinput";
import { TopNav } from "../_components/topnav";
import { checkVerification, createVerification } from "@/server/actions";

export default function SignUpPage() {
  const router = useRouter();

  const [otpSent, setOtpSent] = useState<boolean>(false);

  const [otpValue, setOtpValue] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");   
  const [lastName, setLastName] = useState<string>("");

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
    const phoneNumber = formData.get('phone') as string;
    const res = await createVerification(phoneNumber);
    console.log(res);
    if (typeof res === 'object' && res.error) {
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
        setFirstName(formData.get('firstname') as string);  
        setLastName(formData.get('lastname') as string);
    }
  };

  const handleSignUp = async () => {
    console.log("verifying otp");

    const res = await checkVerification(phoneNumber, otpValue, {firstname: firstName, lastname: lastName, phone: phoneNumber});
    console.log(res);
    if (typeof res === 'object' && res.error) {
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
    }
  };

  return (
    <>
      <TopNav />
      <div className="min-w-screen flex flex-col justify-center items-center h-full">
        <div className="w-fit flex mt-10 flex-col items-center border-2 p-8 gap-6 rounded-lg shadow-xl">
          <h1 className="sm:text-xl text-lg font-semibold">Sign Up</h1>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleFormSubmit}
          >
            {!otpSent && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-row gap-4">
                  <div className="flex flex-col ">
                    <label
                      htmlFor="firstname"
                      className="sm:text-sm text-xs"
                      aria-required
                    >
                      First Name 名字
                    </label>
                    <Input required type="text" name="firstname" />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="lastname"
                      className="sm:text-sm text-xs"
                      aria-required
                    >
                      Last Name 姓氏
                    </label>
                    <Input required type="text" name="lastname" />
                  </div>
                </div>
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
                    name="phone"
                    placeholder="Enter phone number"
                    value="+1"
                  />
                </div>
                <Button type="submit">Sign Up</Button>
              </div>
            )}

            {otpSent && (
              <div className="flex flex-col gap-4">
                <div>
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
            <p className="text-sm">Already have an account? </p>
            <Link
              href="/sign-in"
              className="text-sm text-purple-700 hover:text-purple-100"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
