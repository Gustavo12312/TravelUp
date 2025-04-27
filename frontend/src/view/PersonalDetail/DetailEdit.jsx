import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import authHeader from "../Auth/auth.header";
import { getUserid, isAuthenticated } from "../Auth/auth.utils";

const baseUrl = "http://localhost:3000";

const DetailEdit = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const Authenticated = isAuthenticated();
    const currentuserId = getUserid();

    const [CurrentPhoto, setCurrentPhoto] = useState("");
    const [photoFile, setPhotoFile] = useState(null);

    const {register, handleSubmit, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        if (!Authenticated) {
            navigate("/user/login");
        } else if (userId != currentuserId) {
            navigate("/user/not");
        } else {
            LoadDetail();
        }
    }, [userId, Authenticated, currentuserId, ]);

    function LoadDetail () {
        const url = baseUrl + "/detail/get/" + userId;
        axios.get(url, { headers: authHeader() })
            .then((res) => {
                const data = res.data.data;
                setCurrentPhoto(data.photo || "");
                setValue("fullname", data.fullname || "");
                setValue("birthdate", data.birthdate || "");
                setValue("phone", data.phone || "");
                setValue("passportnumber", data.passportnumber || "");
                setValue("emergencycontact", data.emergencycontact || "");
                setValue("milescard", data.milescard || "");
            })
            .catch((error) => {
                alert("Error server: " + error);
            });
    }

    const onSubmit = (data) => {
        const url = baseUrl + "/detail/update/" + userId;
    
        const formData = new FormData();
        formData.append("fullname", data.fullname || "");
        formData.append("birthdate", data.birthdate || "");
        formData.append("phone", data.phone || "");
        formData.append("passportnumber", data.passportnumber || "");
        formData.append("emergencycontact", data.emergencycontact || "");
        formData.append("milescard", data.milescard || "");
    
        if (photoFile) {
            formData.append("photo", photoFile);
        }
    
        axios
            .put(url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: authHeader()
                }
            })
            .then((response) => {
                if (response.data.success === true) {
                    alert(response.data.message);
                    navigate(-1);
                } else {
                    alert(response.data.message || "Error updating details");
                }
            })
            .catch((error) => {
                alert("Error: " + error);
            });
    };
    

    return (
        <div>
            <div className="mb-3">
                <Link className="btn btn-primary" onClick={() => navigate(-1)}>{'<'}</Link>
            </div>
            <h1 className="mb-3 text-white">Edit Personal Detail</h1>
            <div className="container">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                        {/* Left Column */}
                        <div className="col-md-6">
                            <div className="form-group col-md-8 mb-3">
                                <label className="text-white" htmlFor="fullname">Full Name</label>
                                <input id="fullname" placeholder="Full Name..." type="text" className="form-control"
                                    {...register("fullname")} />
                            </div>

                            <div className="form-group col-md-4 mb-4">
                                <label className="text-white" htmlFor="birthdate">Birthdate</label>
                                <input id="birthdate" type="date" className="form-control"
                                    {...register("birthdate")} />
                            </div>

                            <div className="form-group col-md-4 mb-4">
                                <label className="text-white" htmlFor="phone">Phone</label>
                                <input id="phone" type="text" placeholder="Phone..." className="form-control"
                                    {...register("phone")} />
                            </div>

                            <div className="form-group  col-md-4 mb-4">
                                <label className="text-white" htmlFor="passportnumber">Passport Number</label>
                                <input id="passportnumber" type="text" placeholder="Passport Number..." className="form-control"
                                    {...register("passportnumber")} />
                            </div>

                            <div className="form-group col-md-4 mb-4">
                                <label className="text-white" htmlFor="emergencycontact">Emergency Contact</label>
                                <input id="emergencycontact" type="text" placeholder="Emergency Contact..." className="form-control"
                                    {...register("emergencycontact")} />
                            </div>

                            <div className="form-group col-md-10 mb-4">
                                <label className="text-white" htmlFor="milescard">Milescard</label>
                                <input id="milescard" type="text" placeholder="Milescard..." className="form-control"
                                    {...register("milescard")} />
                            </div>

                            <div className="form-group col-md-8 mb-3">
                                <label className="text-white" htmlFor="photo">Photo</label>
                                <input id="photo" type="file" className="form-control" accept="image/*"
                                    onChange={(e) => setPhotoFile(e.target.files[0])} />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="col-md-6">
                            <div className="form-group mb-3">
                                <label className="text-white d-flex justify-content-center h3">Current Photo:</label>
                                {CurrentPhoto ? (
                                    <div className="d-flex justify-content-center">
                                        <img src={`http://localhost:3000${CurrentPhoto}`} width="400" height="400"
                                            className="mt-3 rounded shadow" alt="Current" />
                                    </div>
                                ) : (
                                    <p className="text-white d-flex justify-content-center">No photo available...</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-2">
                        <button type="submit" className="btn btn-success text-white me-4">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DetailEdit;
