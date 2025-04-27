import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authHeader from "../Auth/auth.header";
import { isAuthenticated, getUserid } from "../Auth/auth.utils";

const baseUrl = "http://localhost:3000";

const RequestAdd = () => {

    const [code, setcode] = useState("");
    const [originCityId, setorigincityId] = useState("");
    const [destinationCityId, setdestinationcityId] = useState("");
    const [Cities, setCities] = useState([]);
    const [Projects, setProjects] = useState([]);
    const [projectId, setprojectId] = useState("");
    const [description, setdescription] = useState("");
    const [isRoundTrip, setIsRoundTrip] = useState(false);
    const [travelDate, settravelDate] = useState(null);
    const [returnDate, setreturnDate] = useState(null);
    const [isHotelNeeded, setisHotelNeeded] = useState();
    const [checkInDate, setcheckInDate] = useState(null);
    const [checkOutDate, setcheckOutDate] = useState(null);
    const [requestStatusId, setrequestStatusId] = useState("");
    const [errors, setErrors] = useState({});
    const [trigger, setTrigger] = useState(0);
    
    const userid = getUserid();


    const navigate = useNavigate();
    const Authenticated = isAuthenticated();

    useEffect(() => {
        if (!Authenticated) {
            navigate("/user/login");
        } else {
            Promise.all([
                axios.get(baseUrl + "/city/list", {headers: authHeader()}),
                axios.get(baseUrl + "/project/list", {headers: authHeader()})
            ])
                .then(([cityRes,projectRes]) => {
                    setCities(cityRes.data.data);
                    setProjects(projectRes.data.data)
                })
                .catch(error => console.error("Error fetching cities:", error));
        }
    }, [Authenticated]);


    useEffect(() => {
        if (requestStatusId != "") {
            if(validateForm()) {
                SendSave();
            }
            
        }
    }, [requestStatusId,trigger]); 

    const handleRefresh = () => {
        setTrigger(prev => prev + 1); 
    };



    function SendSave() {
        const BaseUrl = baseUrl + "/request/create";
    
        const datapost = {
            requestedBy: userid,
            requestStatusId: requestStatusId,
            code:code,
            projectId:projectId,
            description: description,
            originCityId: originCityId,
            destinationCityId: destinationCityId,
            isRoundTrip:isRoundTrip,
            travelDate: travelDate,
            returnDate: returnDate,
            isHotelNeeded: isHotelNeeded,
            checkInDate: checkInDate,
            checkOutDate: checkOutDate,
        }


        axios
            .post(BaseUrl, datapost, { headers: authHeader()})
            .then((response) => {
                if (response.data.success === true) {
                    alert(response.data.message);
                    navigate("/request/list");
                } else {
                    alert(response.data.message || "Error creating request");
                }
            })
            .catch((error) => {
                alert("Error: " + error);
            });
    }
    const validateForm = () => {
        const newErrors = {};
        if (!code.trim()) newErrors.code = "Code is required.";
        if (!projectId) newErrors.projectId = "Project is required.";
        if (!originCityId) newErrors.originCityId = "Origin City is required.";
        if (!destinationCityId) newErrors.destinationCityId = "Destination City is required.";
        if (!travelDate) newErrors.travelDate = "Travel Date is required.";
        if (isRoundTrip && !returnDate) newErrors.returnDate = "Return Date is required.";
        if (isHotelNeeded) {
            if (!checkInDate) newErrors.checkInDate = "Check-In Date is required.";
            if (!checkOutDate) newErrors.checkOutDate = "Check-Out Date is required.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return (
        <div>
            <div className="mb-3">
                <Link className="btn btn-primary" onClick={() => navigate(-1)}>{'<'}</Link>
            </div>
            <h1 className="mb-3 text-white">Add Request</h1>
            <div className="container">
                <form>
                    <div className="row">
                        {/* Left Column */}
                        <div className="col-md-6">
                            <div className="form-group col-md-6 mb-3">
                                <label className="text-white" htmlFor="inputName">Code</label>
                                <input id="inputName" type="text" className={`form-control ${errors.code ? "is-invalid" : ""}`} placeholder="Code..."
                                    value={code} onChange={(value) => setcode(value.target.value)} />
                                    {errors.code && <div className="invalid-feedback">{errors.code}</div>}
                            </div>
    
                            <div className="form-group col-md-6 mb-4">
                                <label className="text-white" htmlFor="inputproject">Project</label>
                                <select id="inputproject"  className={`form-select ${errors.projectId ? "is-invalid" : ""}`}value={projectId}
                                    onChange={(value) => setprojectId(value.target.value)}>
                                    <option value="">Choose...</option>
                                    {Projects.map(city => (
                                        <option key={city.id} value={city.id}>{city.name}</option>
                                    ))}
                                </select>
                                {errors.projectId && <div className="invalid-feedback">{errors.projectId}</div>}
                            </div>

                            <div className="form-group mb-4">
                                <label className="text-white" htmlFor="description">Description</label>
                                <textarea id="description" type="text" className="form-control" placeholder="Description..."
                                    value={description} onChange={(value) => setdescription(value.target.value)} />
                            </div>
    
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group mb-4">
                                        <label className="text-white" htmlFor="inputCity">Origin City</label>
                                        <select id="inputCity"  className={`form-select ${errors.originCityId ? "is-invalid" : ""}`} value={originCityId}
                                            onChange={(value) => setorigincityId(value.target.value)}>
                                            <option value="">Choose...</option>
                                            {Cities.map(city => (
                                                <option key={city.id} value={city.id}>{city.name}</option>
                                            ))}
                                        </select>
                                        {errors.originCityId && <div className="invalid-feedback">{errors.originCityId}</div>}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-4">
                                        <label className="text-white" htmlFor="inputCity1">Destination City</label>
                                        <select id="inputCity1" className={`form-select ${errors.destinationCityId ? "is-invalid" : ""}`} value={destinationCityId}
                                            onChange={(value) => setdestinationcityId(value.target.value)}>
                                            <option value="">Choose...</option>
                                            {Cities.map(city => (
                                                <option key={city.id} value={city.id}>{city.name}</option>
                                            ))}
                                        </select>
                                        {errors.destinationCityId && <div className="invalid-feedback">{errors.destinationCityId}</div>}
                                    </div>
                                </div>
                            </div>  
                        </div>
    
                        {/* Right Column */}
                        <div className="col-md-6">
                            <div className="form-group mb-3">
                                <label className="text-white" htmlFor="inputIsRoundTrip">Is Round Trip</label>
                                <input id="inputIsRoundTrip" type="checkbox" className="form-check-input ms-2"
                                    checked={isRoundTrip} onChange={(value) => setIsRoundTrip(value.target.checked)} />
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label className="text-white" htmlFor="travel">Travel Date</label>
                                        <input id="travel" type="date" className={`form-control ${errors.travelDate ? "is-invalid" : ""}`}
                                            value={travelDate || ""} onChange={(value) => settravelDate(value.target.value)} />
                                            {errors.travelDate && <div className="invalid-feedback">{errors.travelDate}</div>}
                                    </div>
                                </div>

                                {isRoundTrip && (
                                    <div className="col-md-6">
                                     <div className="form-group mb-3">
                                         <label className="text-white" htmlFor="return">Return Date</label>
                                         <input id="return" type="date"  className={`form-control ${errors.returnDate ? "is-invalid" : ""}`}
                                             value={returnDate || ""} onChange={(value) => setreturnDate(value.target.value)} />
                                              {errors.returnDate && <div className="invalid-feedback">{errors.returnDate}</div>}
                                     </div>
                                 </div>
                                )}
                            </div>
    
                            <div className="form-group mb-3">
                                <label className="text-white" htmlFor="inputIsHotelNeeded">Is Hotel Needed</label>
                                <input id="inputIsHotelNeeded" type="checkbox" className="form-check-input ms-2"
                                    checked={isHotelNeeded} onChange={(value) => setisHotelNeeded(value.target.checked)} />
                            </div>

                            {isHotelNeeded && (
                                <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label className="text-white" htmlFor="checkIn">Check-In Date</label>
                                        <input id="checkIn" type="date"className={`form-control ${errors.checkInDate ? "is-invalid" : ""}`}
                                            value={checkInDate || ""} onChange={(value) => setcheckInDate(value.target.value)} />
                                            {errors.checkInDate && <div className="invalid-feedback">{errors.checkInDate}</div>}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label className="text-white" htmlFor="checkOut">Check-Out Date</label>
                                        <input id="checkOut" type="date" className={`form-control ${errors.checkOutDate ? "is-invalid" : ""}`}
                                            value={checkOutDate || ""} onChange={(value) => setcheckOutDate(value.target.value)} />
                                            {errors.checkOutDate && <div className="invalid-feedback">{errors.checkOutDate}</div>}
                                    </div>
                                </div>
                            </div>
                            )}
    
                            
    
                        </div>
                    </div>
                </form>
                <div className="mt-2">
                    <button type="submit" className="btn btn-info text-white me-4" onClick={() => {setrequestStatusId(3), handleRefresh()}}>
                        Save Draft
                    </button>
                    <button type="submit" className="btn btn-success" onClick={() => {setrequestStatusId(4), handleRefresh()}}>
                        Submit
                    </button>
                </div>
                    
            </div>
        </div>
    );
    
    
};

export default RequestAdd;
