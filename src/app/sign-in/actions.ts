'use server';
import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation';

import { createClient } from "../../../utils/supabase/server";
import { VerifyOtpParams } from "@supabase/supabase-js";


export async function signIn(formData: FormData) {
    const supabase = createClient();

    const inputData = {
        phone: formData.get('phone') as string,
    }
    const formattedPhone = (inputData.phone.startsWith('+') ? inputData.phone : "+" + inputData.phone).replace(/\s/g, '');


    const { data: existingUser, error: checkError } = await supabase.from('profiles').select('*').eq('phone', formattedPhone).maybeSingle();
    if (checkError) {
        console.error('Error checking for existing user', checkError);
        return { error: checkError.message }
    }
    if (existingUser) {
        const { data, error } = await supabase.auth.signInWithOtp({
            phone: formattedPhone,
        })
        if (error) {
            console.error(error)
            return { error: error.message }
        } else {
            // console.log(data)
            return { message: 'OTP sent' }
        }
    }
    else {
        return { error: 'User does not exist. Please Sign Up' };
    }
    
}

export async function verifyOtp(formData: FormData) {
    const supabase = createClient();

    const data = {
        phone: formData.get('phone') as string,
        otp: formData.get('otp') as string,
    }


    const formattedPhone = (data.phone.startsWith('+') ? data.phone : "+" + data.phone).replace(/\s/g, '');
    
    const {data: session, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: data.otp,
        type: 'sms',
    } as VerifyOtpParams);

    if (error) {
        console.error(error)
        return { error: error.message }
    } else {
        // console.log(session)
        redirect('/dashboard')
        
    }
}