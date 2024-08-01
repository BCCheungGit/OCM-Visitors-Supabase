import { createClient } from "../../utils/supabase/server";




export async function searchUsers(query: string) {
    const supabase = createClient();

    if (query === "") {
        const { data: users, error } = await supabase.from('profiles').select('*');
        if (error) {
            console.error(error);
            return { error: error.message }
        }
    
        return { users }

    }
    else {
    const { data: users, error } = await supabase.from('profiles').select('*').ilike('first_name', query);
    if (error) {
        console.error(error);
        return { error: error.message }
    }

    return { users }    
}


}