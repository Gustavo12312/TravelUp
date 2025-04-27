import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import authHeader from "../Auth/auth.header";
import { isAuthenticated, getUserRole } from "../Auth/auth.utils";

const baseUrl = "http://localhost:3000";

const ProjectAdd = () => {
    const navigate = useNavigate();
    const Authenticated = isAuthenticated();
    const role = getUserRole();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        if (!Authenticated) {
            navigate("/user/login");
        } else if (role !== 3) {
            navigate("/user/not");
        }
    }, [Authenticated, role, navigate]);

    const onSubmit = (data) => {
        const BaseUrl = baseUrl + "/project/create";
       
        const datapost = {
            code: data.code,
            name: data.name,
            budget: data.budget
        };

        axios
            .post(BaseUrl, datapost, { headers: authHeader() })
            .then((response) => {
                if (response.data.success === true) {
                    alert(response.data.message);
                    navigate("/project/list");
                } else {
                    alert(response.data.message || "Error creating project");
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

            <form onSubmit={handleSubmit(onSubmit)} className="form-row justify-content-center">
                <h1 className="mb-3 text-white">Add Project</h1>

                <div className="form-group col-md-6 mb-3">
                    <label className="text-white" htmlFor="inputCode">Code</label>
                    <input
                        id="inputCode"
                        type="text"
                        className={`form-control ${errors.code ? "is-invalid" : ""}`}
                        placeholder="Code..."
                        {...register("code", { required: "Code is required" })}
                    />
                    {errors.code && <div className="invalid-feedback">{errors.code.message}</div>}
                </div>

                <div className="form-group col-md-6 mb-3">
                    <label className="text-white" htmlFor="inputName">Name</label>
                    <input
                        id="inputName"
                        type="text"
                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                        placeholder="Project Name..."
                        {...register("name", { required: "Project name is required" })}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                </div>

                <div className="form-group col-md-6 mb-3">
                    <label className="text-white" htmlFor="inputBudget">Budget (€)</label>
                    <input
                        id="inputBudget"
                        type="number"
                        className={`form-control ${errors.budget ? "is-invalid" : ""}`}
                        placeholder="Budget..."
                        min="1"
                        {...register("budget", {
                            required: "Budget is required",
                            min: {
                                value: 1,
                                message: "Budget must be at least 1"
                            }
                        })}
                    />
                    {errors.budget && <div className="invalid-feedback">{errors.budget.message}</div>}
                </div>

                <button type="submit" className="btn btn-success">
                    Save
                </button>
            </form>
        </div>
    );
};

export default ProjectAdd;
