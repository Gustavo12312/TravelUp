import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import axios from "axios";
import React, { useEffect,useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import authHeader from "../Auth/auth.header";
import { isAuthenticated } from "../Auth/auth.utils";

const baseUrl = "http://localhost:3000";

const QuoteAdd = ({ onRefresh }) => {
    const [agencies, setAgencies] = useState([]);
    const { requestId } = useParams();
    const navigate = useNavigate();
    const Authenticated = isAuthenticated();

    // React Hook Form Setup
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        if (!Authenticated) {
            navigate("/user/login");
        } else {
            LoadAgency();            
        }
    }, [Authenticated]);

    function LoadAgency() {
        axios.get(baseUrl + "/agency/list", { headers: authHeader() })
                .then(response => {
                    setAgencies(response.data.data);
                })
                .catch(error => {
                    console.error("Error fetching agencies:", error);
                });
    }

    // Form submit function
    const onSubmit = (data) => {
        const quoteData = {
            requestId: requestId,
            agencyId: data.agencyId
        };

        axios.post(baseUrl + "/quote/create", quoteData, { headers: authHeader() })
            .then(response => {
                if (response.data.success) {
                    alert("Quote created successfully!");
                    onRefresh();
                } else {
                    alert("Error creating quote: " + response.data.message);
                }
            })
            .catch(error => {
                console.error("Error creating quote:", error);
                alert("Error creating quote.");
            });
    };

    return (
        <div>
            <h1 className="mb-3 text-white">Add Quote</h1>
            <div className="container">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group mb-3">
                                <label className="text-white" htmlFor="agency">Agency</label>
                                <select
                                    id="agency"
                                    className={`form-select ${errors.agencyId ? "is-invalid" : ""}`}
                                    {...register("agencyId", {
                                        required: "Agency is required"
                                    })}
                                >
                                    <option value="">Select Agency...</option>
                                    {agencies.map(agency => (
                                        <option key={agency.id} value={agency.id}>
                                            {agency.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.agencyId && <div className="invalid-feedback">{errors.agencyId.message}</div>}
                            </div>
                        </div>
                    </div>

                    <div className="mt-2">
                        <button type="submit" className="btn btn-success">
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default QuoteAdd;
