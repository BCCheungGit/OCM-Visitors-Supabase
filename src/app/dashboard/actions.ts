"use server";

import { redirect } from 'next/navigation';

import { createClient } from "../../../utils/supabase/server";


export async function updateImage(formData: FormData) {
    
    const client = createClient();

    const currentUser = await client.auth.getUser();


    const imageData = {
        image: formData.get('image') as string,
    }
    
    console.log(imageData);
    const { data, error } = await client.from('profiles').update({
        image: imageData.image,
    }).eq('id', currentUser?.data.user?.id).single();

    if (error) {
        console.error('Error updating image', error);
        return { error: error.message }
    }
    else {
        console.log(data);
        return { message: 'Image updated' }

    }
    


}