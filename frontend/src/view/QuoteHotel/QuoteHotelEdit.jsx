import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import authHeader from "../Auth/auth.header";
import { isAuthenticated } from "../Auth/auth.utils";
import { useForm } from "react-hook-form";

const baseUrl = "http://localhost:3000";

const QuoteHotelEdit = ({ show, handleClose, quotehotelId, onRefresh, destId }) => {
    const [Hotels, setHotels] = useState([]);
    const [formHotel, setFormHotel] = useState(null);
    const navigate = useNavigate();
    const Authenticated = isAuthenticated();

    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        if (!Authenticated) {
            navigate("/user/login");
        } else {
            LoadHotel(); 
        }
    }, [quotehotelId, Authenticated]);

    useEffect(() => {
        if (!formHotel || Hotels.length === 0) return;

        setValue("hotelId", formHotel.hotelId);
        setValue("checkInDate", formHotel.checkInDate);            
        setValue("checkOutDate", formHotel.checkOutDate);            
        setValue("pricePerNight", formHotel.pricePerNight);

    }, [formHotel, Hotels, setValue]);

    function LoadHotel(){
        const url = baseUrl + "/quotehotel/get/" + quotehotelId;
            Promise.all([
                axios.get(url, { headers: authHeader() }),
                axios.get(baseUrl + "/hotel/get/city/"+ destId, { headers: authHeader() })
            ])
                .then(([quotehotelRes, hotelRes]) => {
                    setHotels(hotelRes.data.data);
                    setFormHotel(quotehotelRes.data.data);
                })
                .catch((error) => {
                    alert("Error server: " + error);
                });
    }

    const onSubmit = (data) => {
        const url = baseUrl + '/quotehotel/update/' + quotehotelId;
        const datapost = {
            hotelId: data.hotelId,
            checkInDate: data.checkInDate,
            checkOutDate: data.checkOutDate,
            pricePerNight: data.pricePerNight
        };

        axios
            .put(url, datapost, { headers: authHeader() })
            .then((response) => {
                if (response.data.success === true) {
                    alert(response.data.message);
                    handleClose();
                    onRefresh();
                } else {
                    alert(response.data.message || "Error updating hotel");
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
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Hotel</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group mb-3 col-md-6">
                                <label>Hotel</label>
                                <select className="form-select" {...register("hotelId", { required: "Hotel is required" })}>
                                    <option value="">Choose...</option>
                                    {Hotels.map(hotel => (
                                        <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                                    ))}
                                </select>
                                {errors.hotelId && <span className="text-danger">{errors.hotelId.message}</span>}
                            </div>

                            <div className="row">
                                {/* Left Column */}
                                <div className="col-md-6">
                                    <div className="form-group mb-3 mt-6">
                                        <label>Check-In Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            {...register("checkInDate", { required: "Check-in date is required" })}
                                        />
                                        {errors.checkInDate && <span className="text-danger">{errors.checkInDate.message}</span>}
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="col-md-6">
                                    <div className="form-group mb-3 mt-6">
                                        <label>Check-Out Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            {...register("checkOutDate", { required: "Check-out date is required" })}
                                        />
                                        {errors.checkOutDate && <span className="text-danger">{errors.checkOutDate.message}</span>}
                                    </div>
                                </div>

                                <div className="form-group mb-3 col-md-6">
                                    <label>Price Per Night (€)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="€..."
                                        min="1"
                                        {...register("pricePerNight", { required: "Price per night is required", min: { value: 1, message: "Price must be at least 1" } })}
                                    />
                                    {errors.pricePerNight && <span className="text-danger">{errors.pricePerNight.message}</span>}
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="submit" className="btn btn-success">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuoteHotelEdit;
