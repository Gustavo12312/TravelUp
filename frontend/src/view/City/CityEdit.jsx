import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import axios from "axios";
import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form"; // Import react-hook-form
import authHeader from "../Auth/auth.header";
import { isAuthenticated, getUserRole } from "../Auth/auth.utils";

const baseUrl = "http://localhost:3000";

const CityEdit = () => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm(); // Initialize react-hook-form
    const { cityId } = useParams();
    const navigate = useNavigate();
    const Authenticated = isAuthenticated();
    const role = getUserRole();

    useEffect(() => {
        if (!Authenticated) {
            navigate("/user/login");
        } else if (role !== 3 && role !== 2) {
            navigate("/user/not");
        } else {
            LoadCity();            
        }
    }, [cityId, Authenticated, role]);

    function LoadCity() {
        const url = `${baseUrl}/city/get/${cityId}`;
            axios.get(url, { headers: authHeader() })
                .then((res) => {
                    if (res.data.success) {
                        const data = res.data.data;
                        setValue("name", data.name); 
                    } else {
                        alert("Error fetching data");
                    }
                })
                .catch((error) => {
                    alert("Error server: " + error);
                });
    }

    const onSubmit = (data) => {
        const url = baseUrl + '/city/update/' + cityId;
        const datapost = {
            name: data.name,
        };

        axios
            .put(url, datapost, { headers: authHeader() })
            .then((response) => {
                if (response.data.success === true) {
                    alert(response.data.message);
                    navigate("/city/list");
                } else {
                    alert(response.data.message || "Error updating city");
                }
            })
            .catch((error) => {
                alert("Error: " + error);
            });
    };

    return (
        <div>
            <div className="mb-3">
                <Link className="btn btn-primary" onClick={() => navigate(-1)}>
                    {'<'}
                </Link>
            </div>
            <div className="form-row justify-content-center">
                <h1 className="mb-3 text-white">City Edit</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Name Input */}
                    <div className="form-group col-md-6 mb-3">
                        <label className="text-white" htmlFor="inputName">Name</label>
                        <input
                            id="inputName"
                            type="text"
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            placeholder="City Name..."
                            {...register("name", { required: "Name is required" })}
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="btn btn-success">
                        Update
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CityEdit;
