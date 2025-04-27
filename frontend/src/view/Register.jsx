import React, { useEffect, useState } from "react"; 
import {useForm} from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "./Auth/auth.service";
import axios from "axios";
import authHeader from "./Auth/auth.header";
import { getUserid } from "./Auth/auth.utils";


const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">This input is mandatory!</div>
    );
    }
};
const baseUrl = "http://localhost:3000";

export default function RegisterComponent() { 
    const [loading, setLoading] = useState (false); 
    const [message, setMessage] = useState("");
    const [roles, setRoles] = useState([]);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm();

    useEffect(() => {
        axios.get(baseUrl + `/role/list`, { headers: authHeader() })
            .then((res) => {
                if (res.data.success) {
                    setRoles(res.data.data);
                } else {
                    setMessage("Error fetching roles.");
                }
            })
            .catch(() => setMessage("Error fetching roles."));
    }, []);

    
    const createdetail = () => {

        const userId=getUserid();
        const BaseUrl = baseUrl + "/detail/create";
            
                const datapost = {
                    userId
                }
        
                axios
                    .post(BaseUrl, datapost, { headers: authHeader()})
                    .then((response) => {
                        if (response.data.success !== true) {
                            alert(response.data.message || "Error creating agency");
                        }
                    })
                    .catch((error) => {
                        alert("Error: " + error);
                    });

    };
    
    const onSubmit = async (data) => {
        setMessage("");
        setLoading(true);

        const { username, email, password, roleId } = data;

        AuthService.register (username, email, password, roleId)
            .then((res) => {
                if (!res) {
                    setMessage ("Register failed.");
                    setLoading (false);
                } else{
                    createdetail();
                    navigate("/homepage");
                }
            })
            .catch((error) => {
                setMessage ("Register failed.");
                setLoading (false);
            });                                        
    };

    return (
        <div className="container justify-content-center col-md-4">
            <div className="card card-container p-4">
                <h1 className="mb-3">Register</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group mb-3">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            className="form-control"
                            name="username"
                            {...register("username", { required: "Username is mandatory!" })} />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="text"
                            className="form-control"
                            name="username"
                            {...register("email", { required: "Email is mandatory!" })} />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="form-control"
                            name="password"
                            {...register("password", { required: "Password is mandatory!" })} />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="roleId">Select Role</label>
                        <select id="roleId" className="form-select"
                            {...register("roleId", { required: "Role selection is required!" })}>
                            <option value="">Choose...</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>{role.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group mb-3">
                        <Link to={"/user/login"} >Already have an account? Login</Link>
                    </div>
                    <div className="form-group mb-3">
                        <button className="btn btn-primary btn-block">
                            <span>Register</span>
                        </button>
                    </div>
                    {message && (
                        <div className="form-group">
                            <div className="alert alert-danger" role="alert">
                                {message}
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );    
}