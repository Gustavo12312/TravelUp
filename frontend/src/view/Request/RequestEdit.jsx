import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import authHeader from "../Auth/auth.header";
import { getUserRole, isAuthenticated } from "../Auth/auth.utils";
import QuoteAdd from "../Quote/QuoteAdd";
import QuoteList from "../Quote/QuoteList";
import JustificationAdd from "../Justification/JustificationAdd";
import CommentSidebar from "../RequestComment/CommentSidebar";

const baseUrl = "http://localhost:3000";

const RequestEdit = () => {
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
    const [isHotelNeeded, setisHotelNeeded] = useState(false);
    const [checkInDate, setcheckInDate] = useState(null);
    const [checkOutDate, setcheckOutDate] = useState(null);
    const [justification, setjustification] = useState("");
    const [requestStatusId, setrequestStatusId] = useState("");
    const [lastStatusId, setlastStatusId] = useState("");
    const [isEditMode, setisEditMode] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [errors, setErrors] = useState({});

    
    const { requestId } = useParams();
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const navigate = useNavigate();
    const Authenticated = isAuthenticated();
    const Role= getUserRole();

    useEffect(() => {
        if (!Authenticated) {
            navigate("/user/login");
        } else {
            const url = baseUrl+"/request/get/"+requestId;
            Promise.all([
                axios.get(url,{headers: authHeader()}),
                axios.get(baseUrl + "/city/list",{headers: authHeader()}),
                axios.get(baseUrl + "/project/list", {headers: authHeader()})
            ])
    
            .then(([requestRes, cityRes,projectRes]) => {
                    setcode(requestRes.data.data.code)
                    setorigincityId(requestRes.data.data.originCityId)
                    setdestinationcityId(requestRes.data.data.destinationCityId)
                    setprojectId(requestRes.data.data.projectId)
                    setdescription(requestRes.data.data.description)
                    setIsRoundTrip(requestRes.data.data.isRoundTrip)
                    settravelDate(requestRes.data.data.travelDate)
                    setreturnDate(requestRes.data.data.returnDate)
                    setisHotelNeeded(requestRes.data.data.isHotelNeeded)
                    setcheckInDate(requestRes.data.data.checkInDate)
                    setcheckOutDate(requestRes.data.data.checkOutDate)
                    setrequestStatusId(requestRes.data.data.requeststatus.id)
                    setlastStatusId(requestRes.data.data.requeststatus.id)
                    setCities(cityRes.data.data);
                    setProjects(projectRes.data.data);
                    setjustification(requestRes.data.data.justification)
            })
            .catch((error) => {
                alert("Error server: " + error);
            });
        }
    }, [requestId, Authenticated]);

    
    useEffect(() => {
        if (requestStatusId != lastStatusId) {
            SendUpdate1();
        }
        setlastStatusId(requestStatusId);
    }, [requestStatusId, lastStatusId]);
    


    useEffect(() => {
        if (requestStatusId !== 3 ) {
          setisEditMode(false);
        } else {
          setisEditMode(true);
        }
      }, [requestStatusId]);
      

    const handleRefresh = () => {
        setRefreshTrigger(prev => prev + 1); 
    };

    const handleReject = () => {
        navigate(-1);
    };

    function SendUpdate1(){
        if(validateForm()) {
            SendUpdate();
        }
    }

    function Submit(){
        if(validateForm()) {
            setrequestStatusId(4);
        }
    }
    const SendUpdate = () => {
        const url = baseUrl + '/request/update/' + requestId;
        
        const datapost = {
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
            .put(url, datapost, {headers: authHeader()})
            .then((response) => {
                if (response.data.success === true) {
                    alert(response.data.message);
                    navigate(-1);
                } else {
                    alert(response.data.message || "Error updating airport");
                }
            })
            .catch((error) => {
                alert("Error: " + error);
            });
    };

    const SendUpdateRequest = (requestStatusId) => {
        const requesturl = baseUrl + '/request/update/' + requestId;
        
        const data = {
            requestStatusId: requestStatusId
        }
        
        axios.put(requesturl, data, {headers: authHeader()})
        .then((res) => {
            if (res.data.success === true) {
                alert(res.data.message);
                navigate(-1);
            } else {
                alert(reqres.data.message || "Error updating request");
            }
        })
        .catch((error) => {
            alert("Error: " + error);
        });     
    };

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
            <div className="mb-3 d-flex justify-content-between">
                <Link className="btn btn-primary" onClick={() => navigate(-1)}>{'<'}</Link>
                <button className="btn btn-primary text-white" onClick={() => setShowComments(true)}>
                    Show Comments
                </button>
                <CommentSidebar requestId={requestId} show={showComments} onClose={() => setShowComments(false)} />
            </div>
            <h1 className="mb-3 text-white">Edit Request</h1>
            <div className="container">
                <form>
                    <div className="row">
                        {/* Left Column */}
                        <div className="col-md-6">
                            <div className="form-group col-md-6 mb-3">
                                <label className="text-white" htmlFor="inputName">Code</label>
                                <input id="inputName" type="text" className={`form-control ${errors.code ? "is-invalid" : ""}`} placeholder="Code..." disabled={!isEditMode}
                                    value={code} onChange={(value) => setcode(value.target.value)} />
                                    {errors.code && <div className="invalid-feedback">{errors.code}</div>}
                            </div>
    
                            <div className="form-group col-md-6 mb-4">
                                <label className="text-white" htmlFor="inputproject">Project</label>
                                <select id="inputproject"className={`form-select ${errors.projectId ? "is-invalid" : ""}`} value={projectId} disabled={!isEditMode}
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
                                <textarea id="description" type="text" className="form-control" placeholder="Description..." disabled={!isEditMode}
                                    value={description} onChange={(value) => setdescription(value.target.value)} />
                            </div>
    
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group mb-4">
                                        <label className="text-white" htmlFor="inputCity">Origin City</label>
                                        <select id="inputCity" className={`form-select ${errors.originCityId ? "is-invalid" : ""}`} value={originCityId} disabled={!isEditMode}
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
                                        <select id="inputCity1" className={`form-select ${errors.destinationCityId ? "is-invalid" : ""}`} value={destinationCityId} disabled={!isEditMode}
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
                                <input id="inputIsRoundTrip" type="checkbox" className="form-check-input ms-2" disabled={!isEditMode}
                                    checked={isRoundTrip} onChange={(value) => setIsRoundTrip(value.target.checked)} />
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label className="text-white" htmlFor="travel">Travel Date</label>
                                        <input id="travel" type="date" className={`form-control ${errors.travelDate ? "is-invalid" : ""}`} disabled={!isEditMode}
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
                                <input id="inputIsHotelNeeded" type="checkbox" className="form-check-input ms-2" disabled={!isEditMode}
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

                {requestStatusId ===3 && (
                    <div className="mt-2">
                        <button type="submit" className="btn btn-info text-white me-4" onClick={() => SendUpdate1()}>
                            Save Draft
                        </button>
                        <button type="submit" className="btn btn-success" onClick={() => Submit()}>
                            Submit
                        </button>
                </div>

                )}           

            </div>
            

            {requestStatusId ===7 && Role===2 && (
                <div>
                    <div className="mt-5">
                        <QuoteAdd onRefresh={handleRefresh} > </QuoteAdd>
                    </div>
                    <div className="mt-5">
                        <QuoteList refreshTrigger={refreshTrigger} select={false} selected={false} disable={false} refreshstatus={null} oriId={originCityId} destId={destinationCityId} ></QuoteList>
                    </div>
                </div>
            )}

            {requestStatusId ===2 && (
                <div>
                    <div className="mt-5">
                        <QuoteList refreshTrigger={refreshTrigger} select={true} selected={false} disable={true} refreshstatus={() => SendUpdateRequest(6)}> </QuoteList>
                    </div>
                </div>
            )}

            {(requestStatusId ===6 || requestStatusId ===1 || requestStatusId ===5) && (
                <div>
                    <div className="mt-5">
                        <QuoteList refreshTrigger={refreshTrigger} select={false} selected={true} disable={true} refreshstatus={null}> </QuoteList>
                    </div>
                </div>
            )}

            {requestStatusId ===7 && Role===2 && (
                <div className="mt-2">
                    <button type="submit" className="btn btn-info text-white mt-3 me-4" onClick={() => SendUpdateRequest(2)}>
                        Finish Quoting
                    </button>
                </div>
            )}

            {requestStatusId ===6 && Role===3 && (
                <div className="mt-2">
                    <button type="submit" className="btn btn-danger text-white mt-3 me-4" onClick={() => setShowAdd(true)}>
                        Reject
                    </button>
                    <JustificationAdd requestId={requestId} show={showAdd} handleClose={() => setShowAdd(false)} onRefresh={handleReject} />
                    <button type="submit" className="btn btn-success text-white mt-3 me-4" onClick={() => SendUpdateRequest(5)}>
                        Approve
                    </button>
                </div>
            )}

            {requestStatusId ===1 && justification!= "" && justification!= null &&(
                <div className="mt-4">
                    <span className="text-white h6" ><strong className="text-white h4" >Justification: </strong> {justification}</span>
                </div>
            )}

           
        </div>
        
    );
};

export default RequestEdit;
