import { revalidatePath } from "next/cache";
import { createAdminClient } from "../../utils/supabase/admin";
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


export async function deleteUser(userId: string) {
    const supabase = createAdminClient();

    const { data, error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
        console.log(error);
    } else {
        console.log("successfully deleted user: ", userId)
        revalidatePath("/admin");
        return { data };
    }
}