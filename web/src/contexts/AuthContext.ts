import { User } from '@supabase/supabase-js';
import { createContext } from 'react';

interface IAuthContext {
    user?: User | null;
    signOut: () => void;
}

export const AuthContext = createContext<IAuthContext>({
    user: null,
    signOut: () => {},
});
