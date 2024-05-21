import supabase from '../supabase/supabase_client';

interface AuthResult {
    session?: any;
    error?: string;
}

async function authenticateUser(
    cpnzID: string,
    password: string
): Promise<AuthResult> {
    try {
        // Authenticate against Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email: `${cpnzID}@cpnz.org.nz`,
            password: password,
        });

        if (error) {
            return { error: error.message };
        }

        if (data && data.session) {
            return { session: data.session };
        }
        console.log(data.session);

        return { error: 'Authentication failed, no session available.' };
    } catch (error: any) {
        return { error: error.message || 'Failed to authenticate' };
    }
}

export { authenticateUser };
