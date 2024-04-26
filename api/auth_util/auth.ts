import prisma from '../db/database';
import supabase from '../supabase/supabase_client';

interface AuthResult {
  session?: any;
  error?: string;
}

async function authenticateUser(id: number, password: string): Promise<AuthResult> {
    try {
        // Fetch user by ID
        const user = await prisma.patrols.findUnique({
            where: { id },
            select: { email: true }
        });

        if (!user) {
            return { error: "User not found" };
        }

        // Authenticate against Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email: user.email,
            password: password
        });

        if (error) {
            return { error: user.email };
        }

        if (data && data.session) {
            return { session: data.session };
        }

        return { error: "Authentication failed, no session available." };
    } catch (error: any) {
        return { error: error.message || 'Failed to authenticate' };
    }
}

export { authenticateUser };
