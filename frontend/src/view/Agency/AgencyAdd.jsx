import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form"; // Import React Hook Form
import authHeader from "../Auth/auth.header";
import { isAuthenticated, getUserRole } from "../Auth/auth.utils";

const baseUrl = "http://localhost:3000";

const AgencyAdd = () => {
  const navigate = useNavigate();
  const Authenticated = isAuthenticated();
  const role = getUserRole();

  // Initialize react-hook-form
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (!Authenticated) {
      navigate("/user/login");
    } else if (role !== 3 && role !== 2) {
      navigate("/user/not");
    }
  }, [Authenticated]);

  // Function to handle form submission
  const onSubmit = (data) => {
    const BaseUrl = baseUrl + "/agency/create";
    
    const datapost = {
        name: data.name,
        email: data.email,
        isActive: data.isActive
      };
    axios
      .post(BaseUrl, datapost, { headers: authHeader() })
      .then((response) => {
        if (response.data.success) {
          alert(response.data.message);
          navigate("/agency/list");
        } else {
          alert(response.data.message || "Error creating agency");
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-row justify-content-center">
          <h1 className="mb-3 text-white">Add Agency</h1>

          {/* Name Input */}
          <div className="form-group col-md-6 mb-3">
            <label className="text-white" htmlFor="inputName">Name</label>
            <input
              id="inputName"
              type="text"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              placeholder="Agency Name..."
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
          </div>

          {/* Email Input */}
          <div className="form-group col-md-6 mb-3">
            <label className="text-white" htmlFor="inputEmail">Email</label>
            <input
              id="inputEmail"
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="Agency Email..."
              {...register("email", { 
                required: "Email is required", 
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email format"
                }
              })}
            />
            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
          </div>

          {/* IsActive Checkbox */}
          <div className="form-group col-md-6 mb-3">
            <label className="text-white" htmlFor="inputIsActive">IsActive</label>
            <input
              id="inputIsActive"
              type="checkbox"
              className="form-check-input p-2 ms-3"
              {...register("isActive")}
            />
          </div>

        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-success">
          Save
        </button>
      </form>
    </div>
  );
};

export default AgencyAdd;
