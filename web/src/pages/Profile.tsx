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
import placeholder from '../assets/images/placeholder.png'
import { Input } from '@components/ui/input';

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
            <div className='text-center flex-col min-h-screen flex'>
                <div className='bg-[#eef6ff] h-28 mb-4 flex items-center justify-start pl-8 pt-4'>
                    <div className="">
                        <img src={placeholder} alt="placeholder" className="rounded-full w-12 h-12"/>
                    </div>
                    <div>
                        <h1 className='font-bold text-left pl-4 text-2xl'>
                            Profile
                        </h1>
                    </div>
                </div>
                <div>
                    <Form>
                        <div className='bg-[#eef6ff] py-6 mx-8 mt-10 space-y-5 text-left pl-7 rounded-md'>
                            <FormItem className='flex flex-col pr-8'>
                                <label htmlFor="name" className='font-semibold'>Name: </label>
                                    <Input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={currentUserDetails?.name}
                                        readOnly={!editable}
                                        disabled
                                        className='rounded-md px-3 py-2 w-auto'
                                    />
                            </FormItem>
                            <FormItem className='flex flex-col pr-8'>
                                <label htmlFor="cpnzId" className='font-semibold'>CPNZ ID: </label>
                                <Input
                                    type="text"
                                    id="cpnzId"
                                    name="cpnzId"
                                    value={currentUserDetails?.id}
                                    disabled
                                    className='rounded-md px-3 py-2'
                                />
                            </FormItem>
                            <FormItem className='flex flex-col pr-8'>
                                <label htmlFor="email" className='font-semibold'>Email: </label>
                                <Input
                                    type="email"
                                    id="email"
                                    name="email"
                                    disabled={!editable}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className='rounded-md px-3 py-2'
                                />
                            </FormItem>
                            <FormItem className='flex flex-col pr-8'>
                                <label htmlFor="password" className='font-semibold'>Password: </label>
                                <Input
                                    type="password"
                                    id="password"
                                    name="password"
                                    disabled={!editable}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className='rounded-md px-3 py-2'
                                />
                            </FormItem>
                            {editable && (
                                <FormItem className='flex flex-col pr-8'>
                                    <label htmlFor="confirmPassword" className='font-semibold'>
                                        Confirm Password: </label>
                                    <Input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className='rounded-md px-3 py-2'
                                    />
                                    {errorMessage && <p>{errorMessage}</p>}
                                </FormItem>
                            )}
                            <FormItem className='flex flex-col pr-8'>
                                <label htmlFor="vehicles" className='font-semibold'>Vehicles: </label>
                                <Input
                                    type="text"
                                    id="vehicles"
                                    name="vehicles"
                                    disabled={!editable}
                                    defaultValue={currentUserDetails?.vehicles}
                                    className='rounded-md px-3 py-2'
                                />
                            </FormItem>
                            <div>
                                {!editable ? (
                                    <Button onClick={handleEdit} className='bg-cpnz-blue-900 mt-4 w-28'>Edit</Button>
                                ) : (
                                    <Button
                                        onClick={handleSave}
                                        disabled={password != confirmPassword}
                                        className='bg-cpnz-blue-900 mt-4 w-28'
                                    >
                                        Save
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
}
