'use server';
import { revalidatePath } from "next/cache";
import { setCookie } from 'nookies'
import { redirect } from 'next/navigation';

import { createClient } from "../../../utils/supabase/server";
import { VerifyOtpParams } from "@supabase/supabase-js";




export async function signUp(formData: FormData) {

    const supabase = createClient();


    const inputData = {
        first_name: formData.get('first-name') as string,
        last_name: formData.get('last-name') as string,
        phone: formData.get('phone') as string,
    }

    const formattedPhone = inputData.phone.startsWith('+') ? inputData.phone : "+" + inputData.phone;
    const {data: existingUser, error: checkError} = await supabase.from('profiles').select('*').eq('phone', formattedPhone).maybeSingle();


    if (checkError) {
        console.error('Error checking for existing user', checkError);
        return { error: checkError.message}
    }

    if (existingUser) {
        console.error('User already exists')
        return { error: 'User already exists. Please Sign In'};
    }

    const { data, error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone, 
        options: {
            data: {
                first_name: inputData.first_name,
                last_name: inputData.last_name,
                phone: formattedPhone,
            }
        }
    } )

    if (error) {
        console.error(error)
        return { error: error.message }

    } else {
        console.log(data)

        return { message: 'OTP sent' }
    }

}


export async function verifyOtp(formData: FormData) {
    const supabase = createClient();

    const data = {
        phone: formData.get('phone') as string,
        otp: formData.get('otp') as string,
    }

    console.log(formData)

    const formattedPhone = data.phone.startsWith('+') ? data.phone : "+" + data.phone;
    
    const {data: session, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: data.otp,
        type: 'sms',
    } as VerifyOtpParams);

    if (error) {
        console.error(error)
        return { error: error.message }
    } else {
        console.log(session)
        redirect('/')
    }
}