"use server";

import { createClient } from "../../../utils/supabase/server"




export const is_claims_admin = async () => {
    const supabase = createClient();

    const { data, error } = await supabase
    .rpc('is_claims_admin', {});
    console.log("is admin: " , data)
    if (error) {
        console.error(error);
    }
    return data;
  }


