import profile from "../assets/images/user.png";
import home from "../assets/images/home.png";
import { useNavigate } from "react-router";
import {ChevronRight } from "lucide-react";

const BottomNavBar = () => {
  const navigate = useNavigate();

  // Function to navigate to the profile page when profile button is clicked
  const handleProfile = () => {
    navigate("/profile");
  };

  const handleHome = () => {
    navigate("/home");
  };
  
  const handleLogon = () => {
    navigate("/logon");
  };

  return (
    <div className="bg-[#EEF6FF] mt-6 flex items-center px-10 py-4">
      <div className="font-semibold space-x-10 text-cpnz-blue-900 flex items-center w-full">
        <button className="flex flex-col items-center" onClick={handleHome}>
          <img src={home} alt="home" className="w-7 h-7" />
          Home
        </button>
        <button className="flex flex-col items-center" onClick={handleProfile}>
          <img src={profile} alt="user" className="w-7 h-7" />
          Profile
        </button>
        <button className="text-white bg-cpnz-blue-900 rounded-lg py-3 px-10 font-base w-full flex gap-2 items-center justify-center" onClick={handleLogon}>
          LOG ON <ChevronRight/>
        </button>
      </div>
    </div>
  );
};

export default BottomNavBar;
