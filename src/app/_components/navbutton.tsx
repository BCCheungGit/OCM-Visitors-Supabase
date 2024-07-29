// ClientNav.tsx
"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { createClient } from "../../../utils/supabase/client";
import { User } from '@supabase/supabase-js';

interface ClientNavProps {
    currentUser: User | null;
    
}

const NavButton: React.FC<ClientNavProps> = ({ currentUser }) => {

    const supabaseClient = createClient();
    const handleSignOut = async () => {
        const { error } = await supabaseClient.auth.signOut();
        if (error) {
            console.error('Error signing out', error);
        }
    }


    return (
        <div className="flex justify-end gap-4 items-center w-1/4">
            {!currentUser ? <Button>Sign In</Button> : <Button onClick={handleSignOut}>Sign Out</Button>}
        </div>
    );
};

export default NavButton;
