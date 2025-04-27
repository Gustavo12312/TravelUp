import React, { useEffect, useState } from "react"; 
import {useForm} from "react-hook-form";
import AuthService from "../view/Auth/auth.service";
import { Link, useNavigate } from "react-router-dom";

const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert"> Este campo é de preenchimento obrigatório!</div>
    );
    }
};

export default function LoginComponent() { 
    const [loading, setLoading] = useState (false); 
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    
    const { register, handleSubmit, formState: { errors } } = useForm();


    const onSubmit = async (data) => {
        setMessage("");
        setLoading(true);

        const { email, password } = data;

        AuthService.login(email, password)
            .then((res) => {
                if (!res) {
                    setMessage("Autentication failed.");
                    setLoading(false);
                } else {
                    navigate("/homepage");
                }
            })
            .catch((error) => {
                setMessage("Autentication failed.");
                setLoading(false);
            });
    };
    
    return (
        <div className="container justify-content-center col-md-4 ">
            <div className="card card-container p-4">
            <h1 className="mb-3">Login</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group mb-3">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="text"
                            className="form-control"
                            name="email"
                            {...register("email", { required: "Email é obrigatório!" })} />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="form-control"
                            name="password"
                            {...register("password", { required: "Senha é obrigatória!" })}/>
                    </div>
                    <div className="form-group mb-3">
                        <Link to={"/user/register"} >Dont have an account? Register</Link>
                    </div>
                    <div className="form-group mb-3">
                        <button className="btn btn-primary btn-block">
                            <span>Login</span>
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