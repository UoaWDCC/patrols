import axios from "axios";
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { Button } from '@components/ui/button';
import { Form, FormItem, FormLabel } from '@components/ui/form';
import placeholder from '../assets/images/placeholder.png';
import { Input } from '@components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import car from '../assets/images/car.png';
import BottomNavBar from '@components/BottomNavBar';

// const vehicleDetailsSchema = z.object({
//     name: z.string(),
//     created_at: z.string(),
//     registration_number: z.string(),
//     colour: z.string(),
//     livery: z.boolean(),
//     selected: z.boolean(),
// });

const userDetailsSchema = z.object({
    cpnz_id: z.string(),
    patrol_id: z.string(),
    email: z.string(),
    mobile_phone: z.string(),
    home_phone: z.string(),
    first_names: z.string(),
    surname: z.string(),
    call_sign: z.string(),
    police_station: z.string(),
});

type UserDetails = z.infer<typeof userDetailsSchema>;
// type VehicleDetails = z.infer<typeof vehicleDetailsSchema>;

export default function Profile() {
    const [editable, setEditable] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [currentUserDetails, setCurrentUserDetails] = useState<UserDetails>();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [mobileNumber, setMobileNumber] = useState<string>('');
    const [callSign, setCallSign] = useState<string>('');
    const [patrolName, setPatrolName] = useState<string>('');
    const [policeStation, setPoliceStation] = useState<string>('');
    // const [currentUserVehicles, setCurrentUserVehicles] = useState<
    //     VehicleDetails[]
    // >([]);
    // const [selectedVehicle, setSelectedVehicle] =
    //     useState<VehicleDetails | null>(null);
    // const vehicleSelectRef = useRef<HTMLSelectElement | null>(null);
    // const [canSaveVehicle, setCanSaveVehicle] = useState(false);

    // Prevent fetchUserData from being called continuously
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/user/getUserDetails`
                );

                const { userDetails, patrolDetails } = response.data;
                const parsedUserDetails = userDetailsSchema.parse(userDetails);
                // const parsedVehicleDetails = z
                //     .array(vehicleDetailsSchema)
                //     .parse(vehicleDetails);
                setCurrentUserDetails(parsedUserDetails);
                setCallSign(userDetails.call_sign);
                setPatrolName(patrolDetails.name);
                setPoliceStation(userDetails.police_station);
                // setCurrentUserVehicles(parsedVehicleDetails);
                setEmail(userDetails?.email);
                setMobileNumber(userDetails?.mobile_phone);
                setLoading(false);
            } catch (e) {
                console.log(e);
                setErrorMessage('Failed to fetch user data');
            }
        };

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
            // id: currentUserDetails?.id,
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

    const handleCancel = () => {
        setEditable(false);
        setEmail(currentUserDetails!.email);
        setPassword('');
        setConfirmPassword('');
    };

    const formSchema = z.object({
        cpnzID: z.string(),
        password: z
            .string()
            .min(6, { message: 'Password must be at least 6 characters' }),
        confirmPassword: z
            .string()
            .min(6, { message: 'Password must be at least 6 characters' }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cpnzID: '',
            password: '',
            confirmPassword: '',
        },
    });

    return (
        <div className="text-center flex-col min-h-screen flex max-w-3xl mx-auto">
            <div className="bg-[#eef6ff] h-28 mb-4 pl-8 pt-4">
                <div>
                    <img
                        src={placeholder}
                        alt="placeholder"
                        className="rounded-full w-10 h-10"
                    />
                </div>
                <div>
                    <h1 className="font-bold text-left pt-2 text-2xl">
                        Profile
                    </h1>
                </div>
            </div>
            <div className="bg-[#EEF6FF] py-6 mx-8 my-10 space-y-5 text-left px-7 rounded-md shadow-md">
                <Form {...form}>
                    <FormItem className="flex flex-col w-full">
                        <FormLabel htmlFor="email">Email Address </FormLabel>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            disabled
                            value={email}
                            className="rounded-md border-[#CBD5E1]"
                        />
                    </FormItem>
                    <div className="flex flex-col-2 space-x-6">
                        <FormItem className="flex flex-col flex-1">
                            <FormLabel htmlFor="cpnzId">
                                Mobile Number
                                <Input
                                    type="text"
                                    id="mobileNumber"
                                    name="mobileNumber"
                                    value={mobileNumber}
                                    disabled
                                    className="rounded-md border-[#CBD5E1]"
                                />
                            </FormLabel>
                        </FormItem>
                        <FormItem className="flex flex-col flex-1">
                            <FormLabel htmlFor="id">ID </FormLabel>
                            <Input
                                type="text"
                                id="id"
                                name="id"
                                value={currentUserDetails?.cpnz_id}
                                disabled
                                className="rounded-md border-[#CBD5E1]"
                            />
                        </FormItem>
                    </div>
                    {editable && (
                        <>
                            <FormItem>
                                <FormLabel htmlFor="password">
                                    New Password{' '}
                                </FormLabel>
                                <Input
                                    type="password"
                                    id="password"
                                    name="password"
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="rounded-md border-[#CBD5E1]"
                                />
                            </FormItem>
                            <FormItem className="flex flex-col">
                                <FormLabel
                                    htmlFor="confirmPassword"
                                    className="font-semibold"
                                >
                                    Confirm New Password{' '}
                                </FormLabel>
                                <Input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    className="rounded-md border-[#CBD5E1]"
                                />
                                {errorMessage && <p>{errorMessage}</p>}
                            </FormItem>
                        </>
                    )}
                    {!editable ? (
                        <Button
                            onClick={handleEdit}
                            className="bg-cpnz-blue-900 w-full flex"
                        >
                            Change Password
                        </Button>
                    ) : (
                        <div className="flex gap-4">
                            <Button
                                onClick={handleSave}
                                disabled={password != confirmPassword}
                                className="bg-cpnz-blue-900 mt-4 w-28"
                            >
                                Save
                            </Button>
                            <Button
                                variant={'outline'}
                                onClick={handleCancel}
                                className="border-cpnz-blue-900 mt-4 w-28"
                            >
                                Cancel
                            </Button>
                        </div>
                    )}
                </Form>
            </div>
            <div className="my-6 mx-8 space-y-5 text-left px-8">
                <h2 className="text-2xl">PATROL INFORMATION</h2>
                <Form {...form}>
                    <FormItem className="flex flex-col">
                        <FormLabel htmlFor="cpCallSign">
                            CP Call Sign{' '}
                        </FormLabel>
                        <Input
                            type="text"
                            id="cpCallSign"
                            name="cpCallSign"
                            value={callSign}
                            disabled
                            className="rounded-md px-3 py-2 border-[#CBD5E1]"
                        />
                    </FormItem>
                    <FormItem className="flex flex-col">
                        <FormLabel htmlFor="patrol">Patrol (Region) </FormLabel>
                        <Input
                            type="text"
                            id="patrol"
                            name="patrol"
                            value={patrolName}
                            disabled
                            className="rounded-md px-3 py-2 border-[#CBD5E1]"
                        />
                    </FormItem>
                    <FormItem className="flex flex-col">
                        <FormLabel htmlFor="policeBase">
                            Police Base Station{' '}
                        </FormLabel>
                        <Input
                            type="text"
                            id="policeBase"
                            name="policeBase"
                            disabled
                            value={policeStation}
                            className="rounded-md px-3 py-2 border-[#CBD5E1]"
                        />
                    </FormItem>
                </Form>
            </div>
            <div className="my-6 mx-8 space-y-5 text-left px-7">
                <div className="flex items-center justify-start">
                    <div>
                        <img src={car} alt="car" className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl pl-2">VEHICLE DETAILS</h2>
                </div>
                <Form {...form}>
                    {/* <FormItem className="flex flex-col">
                        <FormLabel htmlFor="vehicles">
                            Patrol Vehicle{' '}
                        </FormLabel>
                        <Input
                            type="text"
                            id="vehicles"
                            name="vehicles"
                            disabled={!editable}
                            defaultValue={currentUserDetails?.vehicles}
                            className="rounded-md px-3 py-2 border-[#CBD5E1]"
                        />
                    </FormItem> */}
                    <div className="flex flex-col-3 space-x-6">
                        <FormItem className="flex flex-col flex-1">
                            <FormLabel htmlFor="reg">Reg. </FormLabel>
                            <Input
                                type="text"
                                id="reg"
                                name="reg"
                                //value={}
                                disabled
                                className="rounded-md px-3 py-2 border-[#CBD5E1]"
                            />
                        </FormItem>
                        <FormItem className="flex flex-col flex-1">
                            <FormLabel htmlFor="id">Colour </FormLabel>
                            <Input
                                type="text"
                                id="colour"
                                name="colour"
                                //value={}
                                disabled
                                className="rounded-md px-3 py-2 border-[#CBD5E1]"
                            />
                        </FormItem>
                        <FormItem className="flex flex-col flex-1">
                            <FormLabel htmlFor="livery">Livery </FormLabel>
                            <select className="rounded-md px-3 py-2 border border-[#CBD5E1]">
                                <option value="" disabled>
                                    Select an option
                                </option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                        </FormItem>
                    </div>
                </Form>
            </div>

            <BottomNavBar />
            {loading ? <></> : <></>}
        </div>
    );
}
//}
