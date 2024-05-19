import profile from "../assets/images/user.png";
import home from "../assets/images/home.png";
import { useNavigate } from "react-router";

const BottomNavBar = () => {
  const navigate = useNavigate();

  // Function to navigate to the profile page when profile button is clicked
  const handleProfile = () => {
    navigate("/profile");
  };

  const handleHome = () => {
    navigate("/home");
  };

  return (
    <div className="bg-[#EEF6FF] h-24 mt-6 flex items-center pl-12 pt-4">
      <div className="font-semibold space-x-11 text-cpnz-blue-900 flex items-center">
        <button className="flex flex-col items-center" onClick={handleHome}>
          <img src={home} alt="home" className="w-7 h-7" />
          Home
        </button>
        <button className="flex flex-col items-center" onClick={handleProfile}>
          <img src={profile} alt="user" className="w-7 h-7" />
          Profile
        </button>
      </div>
    </div>
  );
};

export default BottomNavBar;
