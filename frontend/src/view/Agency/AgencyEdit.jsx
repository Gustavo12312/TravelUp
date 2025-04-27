import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form"; // Import react-hook-form
import authHeader from "../Auth/auth.header";
import { isAuthenticated, getUserRole } from "../Auth/auth.utils";

const baseUrl = "http://localhost:3000";

const AgencyEdit = () => {
  const { agencyId } = useParams();
  const navigate = useNavigate();
  const Authenticated = isAuthenticated();
  const role = getUserRole();

  // Initialize react-hook-form
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    if (!Authenticated) {
      navigate("/user/login");
    } else if (role !== 3 && role !== 2) {
      navigate("/user/not");
    } else {
      LoadAgency();      
    }
  }, [agencyId, Authenticated]);

  function LoadAgency(){
    const url = baseUrl + "/agency/get/" + agencyId;
      axios.get(url, { headers: authHeader() })
        .then((res) => {
          if (res.data.success) {
            const data = res.data.data;           
            setValue("name", data.name);
            setValue("email", data.email);
            setValue("isActive", data.isActive);
          } else {
            alert("Error fetching data");
          }
        })
        .catch((error) => {
          alert("Error server: " + error);
        });
  }

  // Handle form submission
  const onSubmit = (data) => {
    const url = baseUrl + '/agency/update/' + agencyId;

    const datapost = {
        name: data.name,
        email: data.email,
        isActive: data.isActive
      };
    
    axios.put(url, datapost, { headers: authHeader() })
      .then((response) => {
        if (response.data.success === true) {
          alert(response.data.message);
          navigate("/agency/list");
        } else {
          alert(response.data.message || "Error updating agency");
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
        <h1 className="mb-3 text-white">Agency Edit</h1>

        {/* Form with react-hook-form */}
        <form onSubmit={handleSubmit(onSubmit)}>
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

          {/* Submit Button */}
          <button type="submit" className="btn btn-success">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default AgencyEdit;
