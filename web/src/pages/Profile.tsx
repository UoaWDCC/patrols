import axios from 'axios';
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { Button } from '@components/ui/button';
import { Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage } from '@components/ui/form';

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

    //if (!loading) {
        return (
            <div className='text-center flex-col min-h-screen flex'>
                <div className='bg-[#eef6ff] h-28 mb-4'>
                    <h1 className='pt-16 font-bold text-left pl-8 text-2xl'>
                        Profile
                    </h1>
                </div>
                <div>
                    <Form>
                        <div className='bg-[#eef6ff] py-4 mx-8 mt-10 space-y-5 text-left pl-7 rounded-md'>
                        <FormItem>
                            <label htmlFor="name">Name: </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={currentUserDetails?.name}
                                    readOnly={!editable}
                                    disabled
                                    className='bg-white rounded-md px-3 py-2'
                                />
                        </FormItem>
                        <FormItem>
                            <label htmlFor="cpnzId">CPNZ ID: </label>
                            <input
                                type="text"
                                id="cpnzId"
                                name="cpnzId"
                                value={currentUserDetails?.id}
                                disabled
                                className='bg-white rounded-md px-3 py-2'
                            />
                        </FormItem>
                        <FormItem>
                            <label htmlFor="email">Email: </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                disabled={!editable}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='bg-white rounded-md px-3 py-2'
                            />
                        </FormItem>
                        <FormItem>
                            <label htmlFor="password">Password: </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                disabled={!editable}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className='bg-white rounded-md px-3 py-2'
                            />
                        </FormItem>
                        {editable && (
                            <FormItem>
                                <label htmlFor="confirmPassword">
                                    Confirm Password: </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className='bg-white rounded-md px-3 py-2'
                                />
                                {errorMessage && <p>{errorMessage}</p>}
                            </FormItem>
                        )}
                        <FormItem>
                            <label htmlFor="vehicles">Vehicles: </label>
                            <input
                                type="text"
                                id="vehicles"
                                name="vehicles"
                                disabled={!editable}
                                defaultValue={currentUserDetails?.vehicles}
                                className='bg-white rounded-md px-3 py-2'
                            />
                        </FormItem>
                        </div>
                        <div className=''>
                            {!editable ? (
                                <Button onClick={handleEdit} className='bg-cpnz-blue-900 mt-4 hover:bg-cpnz-blue-800 w-32'>Edit</Button>
                            ) : (
                                <Button
                                    onClick={handleSave}
                                    disabled={password != confirmPassword}
                                    className='bg-cpnz-blue-900 mt-4'
                                >
                                    Save
                                </Button>
                            )}
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
//}
