import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "./Auth/auth.utils";
import { useEffect } from "react";

export default function NotAuthorizedComponent() { 
    const Authenticated= isAuthenticated();
    const navigate = useNavigate();

    useEffect(() => {
        if (!Authenticated) {
            navigate("/user/login");
        } 
    }, [Authenticated]);

    
    return (
        <div className="container ">
            <h1 className="mb-3">You cannot acess this page.</h1>
        </div>
    );    
}