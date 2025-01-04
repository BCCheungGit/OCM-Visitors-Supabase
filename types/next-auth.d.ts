// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            firstname: string;
            lastname: string;
            phone: string;
            image: string;
            created_at: string,
            last_signed_in: string,
            events: string,
            active: boolean,
            role: string,

        };
    }

    interface User {
        id: string;
        firstname: string;
        lastname: string;
        phone: string;
        image: string;
        created_at: string,
        last_signed_in: string,
        events: string,
        active: boolean,
        role: string,

    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        firstname: string;
        lastname: string;
        phone: string;
        image: string;
        created_at: string,
        last_signed_in: string,
        events: string,
        active: boolean,
        role: string,

    }
}
