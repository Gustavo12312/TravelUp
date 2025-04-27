import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import authHeader from "../Auth/auth.header";
import { isAuthenticated } from "../Auth/auth.utils";
import { useForm } from "react-hook-form";

const baseUrl = "http://localhost:3000";

const FlightEdit = ({ show, handleClose, flightId, onRefresh, oriId, destId }) => {
    const [allairports, setAllAirports] = useState([]);
    const [oriairports, setOriAirports] = useState([]);
    const [destairports, setDestAirports] = useState([]);
    const [formFlight, setFormFlight] = useState(null);
    const navigate = useNavigate();
    const Authenticated = isAuthenticated();

    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm();

    const isReturnTrip = watch("isReturnTrip");
    const hasStops = watch("hasStops");

    useEffect(() => {
        if (!Authenticated) {
            navigate("/user/login");
        } else {
            LoadFlight();
        }
    }, [flightId, Authenticated]);

    // When flight data and airports are ready, set form values
    useEffect(() => {
        if (!formFlight || allairports.length === 0) return;

        setValue("flightNumber", formFlight.flightNumber);
        setValue("departureAirportId", formFlight.departureAirportId);
        setValue("arrivalAirportId", formFlight.arrivalAirportId);
        setValue("departureDateTime", formatDatetimeLocal(formFlight.departureDateTime));
        setValue("arrivalDateTime", formatDatetimeLocal(formFlight.arrivalDateTime));
        setValue("price", formFlight.price);
        setValue("isReturnTrip", formFlight.isReturnTrip);
        setValue("hasStops", formFlight.hasStops);
    }, [formFlight, allairports, setValue]);

    

    function LoadFlight() {
        const url = baseUrl + "/flight/get/" + flightId;
            Promise.all([
                axios.get(url, { headers: authHeader() }),
                axios.get(baseUrl + "/airport/get/city/" + oriId, { headers: authHeader() }),
                axios.get(baseUrl + "/airport/get/city/" + destId, { headers: authHeader() }),
                axios.get(baseUrl + "/airport/list", { headers: authHeader() })
            ])
            .then(([flightRes, orires, destres, allres]) => {
                setOriAirports(orires.data.data);
                setDestAirports(destres.data.data);
                setAllAirports(allres.data.data);
                const data = flightRes.data.data;
                setFormFlight(data);
            })
            .catch((error) => {
                alert("Error server: " + error);
            });
    }

    function formatDatetimeLocal(dateString) {
        if (!dateString) return "";
        const date = new Date(dateString);
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - offset * 60000);
        return localDate.toISOString().slice(0, 16);
    }

    const onSubmit = (data) => {
        const url = baseUrl + "/flight/update/" + flightId;

        const datapost = {
            flightNumber: data.flightNumber,
            departureAirportId: data.departureAirportId,
            arrivalAirportId: data.arrivalAirportId,
            departureDateTime: data.departureDateTime,
            arrivalDateTime: data.arrivalDateTime,
            price: data.price,
            isReturnTrip: data.isReturnTrip,
            hasStops: data.hasStops
        };

        axios
            .put(url, datapost, { headers: authHeader() })
            .then((response) => {
                if (response.data.success === true) {
                    alert(response.data.message);
                    handleClose();
                    onRefresh();
                } else {
                    alert(response.data.message || "Error updating flight");
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
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Flight</h5>
                            <button type="button" className="btn-close" onClick={handleClose}></button>
                        </div>

                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-check mb-3 d-flex justify-content-center">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            {...register("isReturnTrip")}
                                        />
                                        <label className="form-check-label ms-2">Is Return Trip</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-check mb-3 d-flex justify-content-center">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            {...register("hasStops")}
                                        />
                                        <label className="form-check-label ms-2">Has Stops</label>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group mb-3 col-md-6">
                                <label>Flight Number</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.flightNumber ? "is-invalid" : ""}`}
                                    placeholder="Number..."
                                    {...register("flightNumber", { required: "Flight number is required" })}
                                />
                                {errors.flightNumber && <div className="invalid-feedback">{errors.flightNumber.message}</div>}
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label>Departure Airport</label>
                                        <select
                                            className={`form-select ${errors.departureAirportId ? "is-invalid" : ""}`}
                                            {...register("departureAirportId", { required: "Select departure airport" })}
                                            >
                                            <option value="">Choose...</option>                                           
                                            {hasStops && allairports.map((airport) => (
                                                <option key={airport.id} value={airport.id}>
                                                {airport.name}
                                                </option>
                                            ))}
                                            {!hasStops && isReturnTrip && destairports.map((airport) => (
                                                <option key={airport.id} value={airport.id}>
                                                {airport.name}
                                                </option>
                                            ))}
                                            {!hasStops && !isReturnTrip && oriairports.map((airport) => (
                                                <option key={airport.id} value={airport.id}>
                                                {airport.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.departureAirportId && <div className="invalid-feedback">{errors.departureAirportId.message}</div>}
                                    </div>

                                    <div className="form-group mb-3">
                                        <label>Arrival Airport</label>
                                        <select
                                            className={`form-select ${errors.arrivalAirportId ? "is-invalid" : ""}`}
                                            {...register("arrivalAirportId", { required: "Select arrival airport" })}
                                            >
                                            <option value="">Choose...</option>
                                            {hasStops && allairports.map((airport) => (
                                                <option key={airport.id} value={airport.id}>
                                                {airport.name}
                                                </option>
                                            ))}
                                            {!hasStops && isReturnTrip && oriairports.map((airport) => (
                                                <option key={airport.id} value={airport.id}>
                                                {airport.name}
                                                </option>
                                            ))}
                                            {!hasStops && !isReturnTrip && destairports.map((airport) => (
                                                <option key={airport.id} value={airport.id}>
                                                {airport.name}
                                                </option>
                                            ))}
                                         </select>
                                        {errors.arrivalAirportId && <div className="invalid-feedback">{errors.arrivalAirportId.message}</div>}
                                    </div>

                                    <div className="form-group mb-3">
                                        <label>Price (€)</label>
                                        <input
                                            type="number"
                                            className={`form-control ${errors.price ? "is-invalid" : ""}`}
                                            placeholder="€..."
                                            min="1"
                                            {...register("price", {
                                                required: "Price is required",
                                                min: { value: 1, message: "Price must be at least €1" }
                                            })}
                                        />
                                        {errors.price && <div className="invalid-feedback">{errors.price.message}</div>}
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group mb-3">
                                        <label>Departure Date</label>
                                        <input
                                            type="datetime-local"
                                            className={`form-control ${errors.departureDateTime ? "is-invalid" : ""}`}
                                            {...register("departureDateTime", { required: "Departure date is required" })}
                                        />
                                        {errors.departureDateTime && <div className="invalid-feedback">{errors.departureDateTime.message}</div>}
                                    </div>

                                    <div className="form-group mb-3">
                                        <label>Return Date</label>
                                        <input
                                            type="datetime-local"
                                            className={`form-control ${errors.arrivalDateTime ? "is-invalid" : ""}`}
                                            {...register("arrivalDateTime", { required: "Arrival date is required" })}
                                        />
                                        {errors.arrivalDateTime && <div className="invalid-feedback">{errors.arrivalDateTime.message}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="submit" className="btn btn-success">Add Flight</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FlightEdit;
