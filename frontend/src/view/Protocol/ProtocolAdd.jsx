import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import authHeader from "../Auth/auth.header";
import { isAuthenticated } from "../Auth/auth.utils";

const baseUrl = "http://localhost:3000";

const ProtocolAdd = ({ hotelId, show, handleClose, onRefresh }) => {
    const navigate = useNavigate();
    const Authenticated = isAuthenticated();

    // react-hook-form setup
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        if (!Authenticated) {
            navigate("/user/login");
        }
    }, [Authenticated, navigate]);

    useEffect(() => {
        if (!show) {           
            setValue("discountRate", "");
            setValue("procedure", "");
        }
    }, [show, setValue]);

    const onSubmit = (data) => {
        const url = baseUrl + '/protocol/create/';

        const datapost = {
            hotelId,
            discountRate: data.discountRate,
            procedure: data.procedure
        };

        axios
            .post(url, datapost, { headers: authHeader() })
            .then((response) => {
                if (response.data.success === true) {
                    alert(response.data.message);
                    onRefresh();
                    handleClose();
                } else {
                    alert(response.data.message || "Error updating hotel");
                }
            })
            .catch((error) => {
                alert("Error: " + error);
            });
    };

    return (
        <div className={`modal fade ${show ? "show d-block" : ""}`} tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add Protocol</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group mb-3">
                                <label>Discount Rate</label>
                                <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    className={`form-control ${errors.discountRate ? "is-invalid" : ""}`}
                                    placeholder="Discount Rate..."
                                    {...register("discountRate", {
                                        required: "Discount rate is required",
                                        min: { value: 0, message: "Minimum discount rate is 0" },
                                        max: { value: 100, message: "Maximum discount rate is 100" }
                                    })}
                                />
                                {errors.discountRate && <div className="invalid-feedback">{errors.discountRate.message}</div>}
                            </div>

                            <div className="form-group mb-3">
                                <label>Procedure</label>
                                <textarea
                                    className={`form-control ${errors.procedure ? "is-invalid" : ""}`}
                                    placeholder="Procedure..."
                                    {...register("procedure", { required: "Procedure is required" })}
                                />
                                {errors.procedure && <div className="invalid-feedback">{errors.procedure.message}</div>}
                            </div>

                            <div className="modal-footer">
                                <button type="submit" className="btn btn-success">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProtocolAdd;
