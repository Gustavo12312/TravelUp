import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import authHeader from "../Auth/auth.header";
import { isAuthenticated } from "../Auth/auth.utils";

const baseUrl = "http://localhost:3000";

const JustificationAdd = ({ requestId, show, handleClose, onRefresh }) => {
    const navigate = useNavigate();
    const Authenticated = isAuthenticated();

    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        if (!Authenticated) {
            navigate("/user/login");
        }
    }, [Authenticated, navigate]);

    // Reset the justification when modal is closed
    useEffect(() => {
        if (!show) {
            setValue("justification", "");
        }
    }, [show, setValue]);

    const onSubmit = (data) => {
        const datapost = {
            requestStatusId: 1,
            justification: data.justification,
        };

        const url = baseUrl + "/request/update/" + requestId;

        axios
            .put(url, datapost, { headers: authHeader() })
            .then((response) => {
                if (response.data.success) {
                    alert(response.data.message);
                    handleClose(); 
                    onRefresh(); 
                } else {
                    alert(response.data.message || "Error updating request");
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
                        <h5 className="modal-title">Add Justification</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group mb-3">                                
                                <textarea
                                    type="text"
                                    className="form-control"
                                    placeholder="Justification..."
                                    {...register("justification")}
                                />                               
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" onClick={handleSubmit(onSubmit)}>Reject</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JustificationAdd;
