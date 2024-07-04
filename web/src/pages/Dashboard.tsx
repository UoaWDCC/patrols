import LocationOfInterestTable from "@components/dashboard/LocationOfInterestTable";
import VehicleTable from "@components/dashboard/VehicleTable";

const Dashboard = () => {
    return (
        <>
            <VehicleTable />
            <LocationOfInterestTable />
        </>
    );
}

export default Dashboard;