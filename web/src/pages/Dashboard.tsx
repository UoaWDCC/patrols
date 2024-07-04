import LocationOfInterestTable from "@components/dashboard/LocationOfInterestTable";
import VehicleTable from "@components/dashboard/VehicleTable";

const Dashboard = () => {
    return (
        <>
            <VehicleTable />
            <LocationOfInterestTable showActions={true} />
        </>
    );
}

export default Dashboard;