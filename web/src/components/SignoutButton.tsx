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
        className="bg-cpnz-blue-900 text-md font-semibold hover:bg-cpnz-blue-800"
      >
        Sign Out
      </Button>
    </div>
  );
};

export default SignoutButton;
