import BottomNavBar from "@components/BottomNavBar";
import LocationOfInterestTable from "@components/dashboard/LocationOfInterestTable";
import Reports from "@components/dashboard/Reports";
import VehicleTable from "@components/dashboard/VehicleTable";

const Dashboard = () => {
  return (
    <div className="relative">
      <VehicleTable />
      <LocationOfInterestTable showActions={true} />
      <Reports />

      <BottomNavBar />
    </div>
  );
};

export default Dashboard;
