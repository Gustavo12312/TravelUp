import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import 'sweetalert2/src/sweetalert2.scss';
import React, { useEffect, useState } from "react";
import { Link, UNSAFE_shouldHydrateRouteLoader, useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import axios from "axios";
import authHeader from "../Auth/auth.header";
import { isAuthenticated } from "../Auth/auth.utils";
import FlightAdd from "./QuoteHotelAdd";
import FlightEdit from "./QuoteHotelEdit";
import QuoteHotelEdit from "./QuoteHotelEdit";
import QuoteHotelAdd from "./QuoteHotelAdd";

const baseUrl = "http://localhost:3000";

const QuoteHotelList = ({quoteId, disable, onTotalChange, oriId, destId}) => {
    const [dataHotel, setDataHotel] = useState([]);
    const navigate = useNavigate();
    const [showAdd, setShowAdd] = useState(false);
    const [editingHotelId, setEditingHotelId] = useState(null);
    const Authenticated = isAuthenticated();

    useEffect(() => {
        if (!Authenticated) {
            navigate("/user/login");
        } else {
            LoadHotel();
        }
    }, [Authenticated]);

    useEffect(() => {
            LoadHotel();
    }, [quoteId]);

    useEffect(() => {
        const totalPrice = dataHotel.reduce((acc, hotel) => acc + (hotel.pricePerNight || 0), 0);
        if (onTotalChange) {
            onTotalChange(totalPrice);
        }
    }, [dataHotel, onTotalChange]);


    const handleRefresh = () => {
        LoadHotel(); 
        setEditingHotelId(null);
    };


    function LoadHotel() {
        const url = baseUrl + "/quotehotel/getby/" + quoteId; 
        axios.get(url, { headers: authHeader() })
            .then(res => {
                if (res.data.success) {
                    setDataHotel(res.data.data);
                } else {
                    alert("Error Web Service");
                }
            })
            .catch(error => {
                alert(error);
            });
    }

    function LoadFillData() {
        return dataHotel.map((data, index) => {
            return (
                <tr key={index}>
                    <td>{data.hotel.name}</td>
                    <td>
                        {format(new Date(data.checkInDate), "dd/MM/yyyy")} 
                    </td>
                    <td>
                        {format(new Date(data.checkOutDate), "dd/MM/yyyy")}                                            
                    </td>                 
                    <td>{data.pricePerNight}</td>
                    <td>
                        {!disable &&(
                            <Link className="btn btn-outline-info" onClick={() => setEditingHotelId(data.id)}> Edit</Link>  
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
            text: 'You will not be able to recover this hotel!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.value) {
                SendDelete(id);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelled', 'Your hotel is safe :)', 'error');
            }
        });
    }

    function SendDelete(id) {
        const url = baseUrl + "/quotehotel/delete/" + id;

        axios.delete(url, { headers: authHeader() })
            .then((response) => {
                if (response.data.success) {
                    Swal.fire('Deleted', 'Hotel has been deleted.', 'success');
                    LoadHotel();
                }
            })
            .catch(error => {
                alert("Error deleting hotel");
            });
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Hotels List</h3>
                {!disable && (
                    <div>
                        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-square" viewBox="0 0 16 16">
                                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                            </svg>
                        </button>
                        <QuoteHotelAdd quoteId={quoteId} show={showAdd} handleClose={() => setShowAdd(false)} onRefresh={handleRefresh} destId={destId}/>
                    </div>
                )}
                </div>
            <table className="table table-hover table-striped">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">Hotel</th>
                        <th scope="col">CheckInDate</th>
                        <th scope="col">CheckOutDate</th>
                        <th scope="col">PricePerNight(€)</th>
                        {!disable && (
                            <th colSpan="2">Action</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {dataHotel.length > 0 ? (
                        LoadFillData()
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">No Hotels Found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {editingHotelId && (
                <QuoteHotelEdit
                    quotehotelId={editingHotelId}
                    show={true}
                    handleClose={() => setEditingHotelId(null)}
                    onRefresh={handleRefresh}
                    destId={destId}
                />
            )}

        </div>

        
    );

}

export default QuoteHotelList;
