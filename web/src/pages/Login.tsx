import { useNavigate } from 'react-router-dom';
import { useState, FormEvent } from 'react';
import axios from 'axios';
import { supabaseClient } from '../auth-client/SupabaseClient';

export default function Login() {
    const navigate = useNavigate();
    const [loginId, setLoginId] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevents form data being reset when incorrect details entered

        try {
            const session = await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/login`,
                { id: loginId, password: password }
            );

            const accessToken: string = session.data.session.access_token;
            const refreshToken: string = session.data.session.refresh_token;

            if (!accessToken || !refreshToken) {
                throw new Error('Missing access token or refresh token');
            }

            const { error: sessionError } =
                await supabaseClient.auth.setSession({
                    access_token: accessToken,
                    refresh_token: refreshToken,
                });

            if (sessionError) {
                throw new Error('Unable to set session');
            }

            // Navigates to report upon successful login. Can be changed to any route
            navigate('/report');
        } catch (error) {
            axios.isAxiosError(error)
                ? console.log(error.response?.data.error)
                : console.error('Unexpected error during login:', error);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="loginId">CPNZ ID:</label>
                    <input
                        type="text"
                        id="loginId"
                        name="id"
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button type="submit">Login</button>
            </form>
        </div>
    );
}
