'use server';
import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation';

import { createClient } from "../../../utils/supabase/server";


export async function signIn(formData: FormData) {
    const supabase = createClient();

    const data = {
        phone: formData.get('phone') as string,
    }

    
    const { error } = await supabase.auth.signInWithOtp({
        phone: data.phone,
    })

    if (error) {
        console.error(error)
        return redirect('/error');
    } else {
        return redirect('/verify-otp');
    }





}