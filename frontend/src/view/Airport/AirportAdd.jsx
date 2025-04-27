import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form"; // Import react-hook-form
import authHeader from "../Auth/auth.header";
import { isAuthenticated, getUserRole } from "../Auth/auth.utils";

const baseUrl = "http://localhost:3000";

const AirportAdd = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [cities, setCities] = React.useState([]);
  const navigate = useNavigate();
  const Authenticated = isAuthenticated();
  const role = getUserRole();

  useEffect(() => {
    if (!Authenticated) {
      navigate("/user/login");
    } else if (role !== 3 && role !== 2) {
      navigate("/user/not");
    } else {
      // Fetch cities from the server
      axios.get(baseUrl + "/city/list", { headers: authHeader() })
        .then((response) => {
          setCities(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching cities:", error);
        });
    }
  }, [Authenticated, role, navigate]);

  const onSubmit = (data) => {
    
    const datapost = {
        name: data.name,
        cityId: data.cityId
      };

    const BaseUrl = baseUrl + "/airport/create";

    axios.post(BaseUrl, datapost, { headers: authHeader() })
      .then((response) => {
        if (response.data.success === true) {
          alert(response.data.message);
          navigate("/airport/list");
        } else {
          alert(response.data.message || "Error creating airport");
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
        <h1 className="mb-3 text-white">Add Airport</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name Input */}
          <div className="form-group col-md-6 mb-3">
            <label className="text-white" htmlFor="inputName">Name</label>
            <input
              id="inputName"
              type="text"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              placeholder="Airport Name..."
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
          </div>

          {/* City Select */}
          <div className="form-group col-md-6 mb-4">
            <label className="text-white" htmlFor="inputCity">City</label>
            <select
              id="inputCity"
              className={`form-select ${errors.cityId ? 'is-invalid' : ''}`}
              {...register("cityId", { required: "City is required" })}
            >
              <option value="">Choose...</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
            {errors.cityId && <div className="invalid-feedback">{errors.cityId.message}</div>}
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

export default AirportAdd;
