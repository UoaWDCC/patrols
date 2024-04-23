import prisma from '../db/database';
import supabase from '../supabase/supabase_client';

interface AuthResult {
  session?: any;
  error?: string;
}

// commented out code is for supabase authentication with hashed pw
// async function authenticateUser(id: number, password: string): Promise<AuthResult> {
//     try {
//         const user = await prisma.patrols.findUnique({
//             where: { id: id },
//             select: { email: true }
//         });

//         if (!user) return { error: "User not found" };

//         const { data, error } = await supabase.auth.signInWithPassword({
//             email: user.email,
//             password
//         });

//         if (error) return { error: error.message };

//         if (data && data.session) {
//             return { session: data.session };
//         }

//         return { error: "Authentication failed, no session available." };
//     } catch (error: any) {
//         return { error: error.message || 'Failed to authenticate' };
//     }
// }

// export { authenticateUser };

async function authenticateUser(id: number, password: string): Promise<AuthResult> {
    try {
        // Fetch user by ID
        const user = await prisma.patrols.findUnique({
            where: { id },
            select: { email: true, password: true }
        });

        if (!user) {
            return { error: "User not found" };
        }

        // Compare plain text passwords directly (only for testing)
        if (user.password === password) {
            return { session: { id: user.email } }; // return session here?
        } else {
            return { error: "Invalid credentials" };
        }
    } catch (error: any) {
        return { error: error.message || 'Failed to authenticate' };
    }
}

export { authenticateUser };
