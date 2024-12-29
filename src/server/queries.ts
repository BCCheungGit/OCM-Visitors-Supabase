import { revalidatePath } from "next/cache";
import { createAdminClient } from "../../utils/supabase/admin";
import { createClient } from "../../utils/supabase/server";
import { PrismaClient } from "@prisma/client";



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
    const prisma = new PrismaClient();

    try {
        await prisma.visitors_master.delete({
            where: {
                id: userId
            },
        })
    } catch (e: any) {
        await prisma.$disconnect();
        console.error(e);
        process.exit(1);
    }
    await prisma.$disconnect(); 
}