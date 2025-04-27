import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form"; // Import react-hook-form
import authHeader from "../Auth/auth.header";
import { isAuthenticated, getUserRole } from "../Auth/auth.utils";

const baseUrl = "http://localhost:3000";

const CityAdd = () => {
  const { register, handleSubmit, formState: { errors } } = useForm(); // Initialize react-hook-form
  const navigate = useNavigate();
  const Authenticated = isAuthenticated();
  const role = getUserRole();

  useEffect(() => {
    if (!Authenticated) {
      navigate("/user/login");
    } else if (role !== 3 && role !== 2) {
      navigate("/user/not");
    }
  }, [Authenticated, navigate, role]);

  const onSubmit = (data) => {
    const datapost = {
      name: data.name,
    };

    const url = baseUrl + "/city/create";

    axios
      .post(url, datapost, { headers: authHeader() })
      .then((response) => {
        if (response.data.success) {
          alert(response.data.message);
          navigate("/city/list");
        } else {
          alert(response.data.message || "Error creating city");
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
        <h1 className="mb-3 text-white">Add City</h1>
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
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default CityAdd;
