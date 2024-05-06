import axios from 'axios';
import { useState, useEffect } from 'react';
import { z } from 'zod';

const userDetailsSchema = z.object({
    name: z.string(),
    id: z.number(),
    email: z.string().email(),
    vehicles: z.array(z.string()),
});

type UserDetails = z.infer<typeof userDetailsSchema>;

const getUserDetails = async () => {
    const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user/getUserDetails`
    );

    const userDetails = userDetailsSchema.parse(response.data);
    return userDetails;
};

export default function Profile() {
    const [editable, setEditable] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [currentUserDetails, setCurrentUserDetails] = useState<UserDetails>();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const fetchUserData = async () => {
        const userDetails = await getUserDetails();
        setCurrentUserDetails(userDetails);
        setEmail(userDetails?.email);
        setLoading(false);
    };

    // Prevent fetchUserData to be called continuously
    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        if (
            password !== '' &&
            confirmPassword !== '' &&
            password !== confirmPassword
        ) {
            setErrorMessage('Passwords do not match');
        } else {
            setErrorMessage('');
        }
    }, [password, confirmPassword]);

    const handleEdit = () => {
        setEditable(true);
    };

    const handleSave = async () => {
        const updatedUserData = {
            id: currentUserDetails?.id,
            email: email,
            password: confirmPassword,
            // vehicles: currentUserDetails?.vehicles,
        };
        await axios.patch(
            `${import.meta.env.VITE_API_URL}/user/updateUserDetails`,
            updatedUserData
        );
        setPassword('');
        setConfirmPassword('');
        setEditable(false);
    };

    if (!loading) {
        return (
            <div>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={currentUserDetails?.name}
                        disabled
                    />
                </div>
                <div>
                    <label htmlFor="name">CPNZ ID: </label>
                    <input
                        type="text"
                        id="cpnzId"
                        name="cpnzId"
                        value={currentUserDetails?.id}
                        disabled
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        disabled={!editable}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        disabled={!editable}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {editable && (
                    <div>
                        <label htmlFor="confirmPassword">
                            Confirm Password:
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {errorMessage && <p>{errorMessage}</p>}
                    </div>
                )}
                <div>
                    <label htmlFor="vehicles">Vehicles:</label>
                    <input
                        type="text"
                        id="vehicles"
                        name="vehicles"
                        disabled={!editable}
                        defaultValue={currentUserDetails?.vehicles}
                    />
                </div>
                {!editable ? (
                    <button onClick={handleEdit}>Edit</button>
                ) : (
                    <button
                        onClick={handleSave}
                        disabled={password != confirmPassword}
                    >
                        Save
                    </button>
                )}
            </div>
        );
    }
}
