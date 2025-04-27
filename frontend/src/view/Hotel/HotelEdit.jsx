import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form"; // Import react-hook-form
import authHeader from "../Auth/auth.header";
import { isAuthenticated, getUserRole } from "../Auth/auth.utils";
import ProtocolAdd from "../Protocol/ProtocolAdd";
import ProtocolEdit from "../Protocol/ProtocolEdit";

const baseUrl = "http://localhost:3000";

const HotelEdit = () => {
    const { hotelId } = useParams();
    const navigate = useNavigate();
    const [Cities, setCities] = useState([]);
    const [protocol, setProtocol] = useState(null);
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [refresh, setRefresh] = useState(0);

    // react-hook-form initialization
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    const Authenticated = isAuthenticated();
    const role = getUserRole();

    useEffect(() => {
        if (!Authenticated) {
            navigate("/user/login");
        } else if (role !== 3 && role !== 2) {
            navigate("/user/not");
        } else {
            // Fetch hotel, city list, and protocol data
            const url = baseUrl + "/hotel/get/" + hotelId;
            Promise.all([
                axios.get(url, { headers: authHeader() }),
                axios.get(baseUrl + "/city/list", { headers: authHeader() }),
                axios.get(baseUrl + "/protocol/get/" + hotelId, { headers: authHeader() })
            ])
                .then(([hotelRes, cityRes, protocolRes]) => {
                    if (hotelRes.data.success) {
                        const data = hotelRes.data.data;
                        setValue("name", data.name);  // Populate name field using setValue
                        setValue("cityId", data.cityId); // Populate cityId using setValue
                    } else {
                        alert("Error fetching data");
                    }
                    setCities(cityRes.data.data);

                    if (protocolRes.data.success) {
                        setProtocol(protocolRes.data.data);
                    } else {
                        setProtocol(null); // No protocol found
                    }
                })
                .catch((error) => {
                    alert("Error server: " + error);
                });
        }
    }, [hotelId, Authenticated, refresh]);

    const onSubmit = (data) => {
        const url = baseUrl + '/hotel/update/' + hotelId;

        axios.put(url, data, { headers: authHeader() })
            .then((response) => {
                if (response.data.success) {
                    alert(response.data.message);
                    navigate("/hotel/list");
                } else {
                    alert(response.data.message || "Error updating hotel");
                }
            })
            .catch((error) => {
                alert("Error: " + error);
            });
    };

    const handleRefresh = () => {
        setRefresh(prev => prev + 1);
    };

    return (
        <div>
            <div className="mb-3">
                <Link className="btn btn-primary" onClick={() => navigate(-1)}>{'<'}</Link>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <div className="form-row justify-content-center">
                        <h1 className="mb-3 text-white">Hotel Edit</h1>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* Hotel Name Input */}
                            <div className="form-group col-md-6 mb-3">
                                <label className="text-white" htmlFor="inputName">Name</label>
                                <input
                                    id="inputName"
                                    type="text"
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    placeholder="Hotel Name..."
                                    {...register("name", { required: "Hotel name is required" })}
                                />
                                {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                            </div>

                            {/* City Select */}
                            <div className="form-group col-md-6 mb-4">
                                <label className="text-white" htmlFor="inputCity">City</label>
                                <select
                                    id="inputCity"
                                    className={`form-select ${errors.cityId ? 'is-invalid' : ''}`}
                                    {...register("cityId", { required: "Please select a city" })}
                                >
                                    <option value="">Choose...</option>
                                    {Cities.map(city => (
                                        <option key={city.id} value={city.id}>{city.name}</option>
                                    ))}
                                </select>
                                {errors.cityId && <div className="invalid-feedback">{errors.cityId.message}</div>}
                            </div>

                            <button type="submit" className="btn btn-success">
                                Update
                            </button>

                            {!protocol && (
                                <button
                                    type="button"
                                    className="btn btn-info text-white ms-4"
                                    onClick={() => setShowAdd(true)}
                                >
                                    Add Protocol
                                </button>
                            )}

                           
                        </form>                                                
                    </div>
                </div>

                <ProtocolAdd
                    hotelId={hotelId}
                    show={showAdd}
                    handleClose={() => setShowAdd(false)}
                    onRefresh={handleRefresh}
                />

                <div className="col-md-6 d-flex justify-content-center">
                    {protocol && (
                        <div className="mt-3">
                            <div className="d-flex align-items-center mb-4">
                                <h3 className="text-white">Protocol Information</h3>
                                <Link
                                    className="btn btn-primary ms-4"
                                    onClick={() => setShowEdit(true)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                                    </svg>
                                </Link>
                            </div>

                            <ProtocolEdit
                                hotelId={hotelId}
                                show={showEdit}
                                handleClose={() => setShowEdit(false)}
                                onRefresh={handleRefresh}
                            />

                            <p className="text-white">
                                <strong>Discount Rate: </strong>{protocol.discountRate} %
                            </p>
                            <p className="text-white"><strong>Procedure: </strong>{protocol.procedure}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HotelEdit;
