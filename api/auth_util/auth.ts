import prisma from '../db/database';
import supabase from '../supabase/supabase_client';

interface AuthResult {
  session?: any;
  error?: string;
}

async function authenticateUser(cpnzID: number, password: string): Promise<AuthResult> {
    try {
        const user = await prisma.patrols.findUnique({
            where: { id: cpnzID },
            select: { email: true }
        });

        if (!user) return { error: "User not found" };

        const { data, error } = await supabase.auth.signInWithPassword({
            email: user.email,
            password
        });

        if (error) return { error: error.message };

        if (data && data.session) {
            return { session: data.session };
        }

        return { error: "Authentication failed, no session available." };
    } catch (error: any) {
        return { error: error.message || 'Failed to authenticate' };
    }
}

export { authenticateUser };
