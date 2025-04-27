import { getUserRole } from "../Auth/auth.utils";
import { useState } from "react";
import RequestFacilitator from "./FacilitatorRequests";
import RequestTraveller from "./TravellerRequests";
import RequestManager from "./Manager/ManagerRequests";
import ManagerChart from "./Manager/ManagerChart";

const Homepage = () => {
    const role = getUserRole();
    const [refreshTrigger, setRefreshTrigger] = useState(0);


    const handleRefresh = () => {
        setRefreshTrigger(prev => prev + 1); 
    };

    return (
        <div className="container my-4">
            {/* FACILITATOR VIEW */}
            {role === 2 && (
                <>
                    <h2 className="mb-4 text-center">Facilitator Dashboard</h2>
                    <div className="row">
                        <div className="col-md-6 mb-4">
                            <div className="card shadow-sm">
                                <div className="card-header bg-primary text-white">
                                    Pending Requests
                                </div>
                                <div className="card-body">
                                    <RequestFacilitator status={0} refreshTrigger={refreshTrigger} onRefresh={handleRefresh} />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 mb-4">
                            <div className="card shadow-sm">
                                <div className="card-header bg-success text-white">
                                    Approved Trips
                                </div>
                                <div className="card-body">
                                    <RequestFacilitator status={1} refreshTrigger={refreshTrigger} onRefresh={handleRefresh} />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* MANAGER VIEW */}
            {role === 3 && (
                <>
                    <h2 className="mb-4 text-center text-white">Manager Dashboard</h2>
                    <div className="card shadow-sm mb-5">
                        <div className="card-header bg-warning text-dark">
                            Requests Awaiting Approval
                        </div>
                        <div className="card-body">
                            <RequestManager refreshTrigger={refreshTrigger} onRefresh={handleRefresh} />
                        </div>
                        
                    </div>
                    <div className="d-flex justify-content-center">
                        <div className="card shadow-sm mb-5 col-md-8 ">
                            <div className="card-header bg-warning text-dark">
                            Projects Expenses
                            </div>
                            <div className="card-body">
                                <ManagerChart/>
                            </div>
                            
                            
                            
                        </div>
                    </div>
                    <div>
                        
                    </div>
                </>
            )}

            {/* TRAVELLER VIEW (Always Shown) */}
            <h2 className="mb-4 text-center text-white">Your Travel Requests</h2>
            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-header bg-info text-white">
                            Open Requests
                        </div>
                        <div className="card-body">
                            <RequestTraveller status={0} />
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-header bg-secondary text-white">
                            Upcoming Trips
                        </div>
                        <div className="card-body">
                            <RequestTraveller status={1} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Homepage;
