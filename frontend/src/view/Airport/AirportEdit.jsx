import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import axios from "axios";
import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form"; // Import react-hook-form
import authHeader from "../Auth/auth.header";
import { isAuthenticated, getUserRole } from "../Auth/auth.utils";

const baseUrl = "http://localhost:3000";

const AirportEdit = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [cities, setCities] = React.useState([]);
  const { airportId } = useParams();
  const navigate = useNavigate();
  const Authenticated = isAuthenticated();
  const role = getUserRole();

  useEffect(() => {
    if (!Authenticated) {
      navigate("/user/login");
    } else if (role !== 3 && role !== 2) {
      navigate("/user/not");
    } else {
      LoadAirport();
    }
  }, [airportId, Authenticated, role]);

  function LoadAirport () {
    Promise.all([
      axios.get(baseUrl + "/airport/get/" + airportId, { headers: authHeader() }),
      axios.get(baseUrl + "/city/list", { headers: authHeader() })
    ])
      .then(([airportRes, cityRes]) => {
        if (airportRes.data.success) {
          const data = airportRes.data.data;
          setValue("name", data.name);  // Set initial value for name
          setValue("cityId", data.cityId);  // Set initial value for cityId
        } else {
          alert("Error fetching data");
        }
        setCities(cityRes.data.data);
      })
      .catch((error) => {
        alert("Error server: " + error);
      });

  }

  const onSubmit = (data) => {
    const datapost = {
      name: data.name,
      cityId: data.cityId
    };

    const url = baseUrl + '/airport/update/' + airportId;

    axios
      .put(url, datapost, { headers: authHeader() })
      .then((response) => {
        if (response.data.success) {
          alert(response.data.message);
          navigate("/airport/list");
        } else {
          alert(response.data.message || "Error updating airport");
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
        <h1 className="mb-3 text-white">Airport Edit</h1>

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
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default AirportEdit;
