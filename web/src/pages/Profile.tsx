import placeholder from '../assets/images/placeholder.png';
import BottomNavBar from '@components/BottomNavBar';
import PatrolDetailsForm from '@components/profile/PatrolDetailsForm';
import UserDetailsForm from '@components/profile/UserDetailsForm';
import VehicleDetailsForm from '@components/profile/VehicleDetailsForm';

export default function Profile() {
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
          <h1 className="font-bold text-left pt-2 text-2xl">Profile</h1>
        </div>
      </div>
      <UserDetailsForm />
      <PatrolDetailsForm />
      <VehicleDetailsForm />
      <BottomNavBar />
    </div>
  );
}
