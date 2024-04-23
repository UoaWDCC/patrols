import { useState, useEffect, PropsWithChildren } from 'react';
import { User } from '@supabase/supabase-js';
import { supabaseClient } from '../auth-client/SupabaseClient';
import { AuthContext } from '../contexts/AuthContext';

interface ChildrenType extends PropsWithChildren {}

export default function AuthProvider({ children }: ChildrenType) {
    const [user, setUser] = useState<User>();

    useEffect(() => {
        const getUserData = async function () {
            const {
                data: { session },
                error,
            } = await supabaseClient.auth.getSession();
            if (error) {
                console.log(`Error: ${error}`);
            }
            setUser(session?.user);
        };

        const { data: listener } = supabaseClient.auth.onAuthStateChange(
            function (_event, session) {
                setUser(session?.user);
            }
        );

        getUserData();

        return () => {
            listener?.subscription.unsubscribe();
        };
    }, []);

    const value = {
        user,
        signOut: () => supabaseClient.auth.signOut(),
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
