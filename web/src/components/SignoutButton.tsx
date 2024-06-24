import { Button } from "./ui/button";
import { useAuth } from "../hooks/useAuth";

const SignoutButton = () => {
  const { signOut } = useAuth();

  const handleSignOut = () => {
    signOut(); // Calls the signOut function when the sign out button is clicked
  };

  return (
    <div>
      <Button
        onClick={handleSignOut}
        className="bg-[#FC9191] text-md font-medium hover:bg-[#ff4d4d]"
      >
        Log Out
      </Button>
    </div>
  );
};

export default SignoutButton;
