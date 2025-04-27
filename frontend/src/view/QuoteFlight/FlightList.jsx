import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import 'sweetalert2/src/sweetalert2.scss';
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import axios from "axios";
import authHeader from "../Auth/auth.header";
import { isAuthenticated } from "../Auth/auth.utils";
import FlightAdd from "./FlightAdd";
import FlightEdit from "./FlightEdit";

const baseUrl = "http://localhost:3000";

const FlightList = ({quoteId, disable, onTotalChange, oriId, destId}) => {
    const [dataFlight, setDataFlight] = useState([]);
    const navigate = useNavigate();
    const [showAdd, setShowAdd] = useState(false);
    const [editingFlightId, setEditingFlightId] = useState(null);
    const Authenticated = isAuthenticated();

    useEffect(() => {
        if (!Authenticated) {
            navigate("/user/login");
        } else {
            LoadFlight();
        }
    }, [Authenticated]);

    useEffect(() => {
            LoadFlight();
    }, [quoteId]);

    useEffect(() => {
        const totalPrice = dataFlight.reduce((acc, flight) => acc + (flight.price || 0), 0);
        if (onTotalChange) {
            onTotalChange(totalPrice);
        }
    }, [dataFlight, onTotalChange]);

    const handleRefresh = () => {
        LoadFlight(); 
    };


    function LoadFlight() {
        const url = baseUrl + "/flight/getby/" + quoteId; 
        axios.get(url, { headers: authHeader() })
            .then(res => {
                if (res.data.success) {
                    setDataFlight(res.data.data);
                } else {
                    alert("Error Web Service");
                }
            })
            .catch(error => {
                alert(error);
            });
    }

    function LoadFillData() {
        return dataFlight.map((data, index) => {
            return (
                <tr key={index}>
                    <td>{data.flightNumber}</td>
                    <td>
                        <div className="container">
                            {data.DepartureAirport.name}
                        </div>
                        <div className="container">
                            {format(new Date(data.departureDateTime), "dd/MM/yyyy HH:mm")} 
                        </div>
                    </td>
                    <td>
                        <div className="container">
                            {data.ArrivalAirport.name}
                        </div>
                        <div className="container">
                            {format(new Date(data.arrivalDateTime), "dd/MM/yyyy HH:mm")}
                        </div>                                               
                    </td>                 
                    <td>{data.price}</td>
                    <td>
                        {!disable &&(
                            <Link className="btn btn-outline-info" onClick={() => setEditingFlightId(data.id)}> Edit</Link>  
                        )}                      
                    </td>
                    <td>
                        {!disable &&(
                            <button className="btn btn-outline-danger" onClick={() => OnDelete(data.id)}>Delete</button>
                        )}
                    </td>
                </tr>
            )
        })
    }

    function OnDelete(id) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this flight!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.value) {
                SendDelete(id);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelled', 'Your flight is safe :)', 'error');
            }
        });
    }

    function SendDelete(id) {
        const url = baseUrl + "/flight/delete/" + id;

        axios.delete(url, { headers: authHeader() })
            .then((response) => {
                if (response.data.success) {
                    Swal.fire('Deleted', 'Flight has been deleted.', 'success');
                    LoadFlight();
                }
            })
            .catch(error => {
                alert("Error deleting flight");
            });
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Flights List</h3>
                {!disable && (
                    <div>
                        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-square" viewBox="0 0 16 16">
                                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                            </svg>
                        </button>
                        <FlightAdd quoteId={quoteId} show={showAdd} handleClose={() => setShowAdd(false)} onRefresh={handleRefresh}  oriId={oriId} destId={destId} />
                    </div>
                )}
                
            </div>
            <table className="table table-hover table-striped">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">Flight</th>
                        <th scope="col">Departure</th>
                        <th scope="col">Arrival</th>
                        <th scope="col">Price(€)</th>
                        {!disable && (
                            <th colSpan="2">Action</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {dataFlight.length > 0 ? (
                        LoadFillData()
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">No Flights Found</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {editingFlightId && (
                <FlightEdit flightId={editingFlightId} show={true} handleClose={() => setEditingFlightId(null)} onRefresh={handleRefresh} oriId={oriId} destId={destId} />
            )}

            
        </div>
    );
}

export default FlightList;
