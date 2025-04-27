import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import 'sweetalert2/src/sweetalert2.scss';
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import axios from "axios";
import authHeader from "../Auth/auth.header";
import { isAuthenticated, getUserRole } from "../Auth/auth.utils";
import "../View.css"

const baseUrl = "http://localhost:3000";

const HotelList = () => {
    const [dataHotel, setDataHotel] = useState([]);
    const navigate = useNavigate();
    const Authenticated = isAuthenticated();
    const role = getUserRole();

    useEffect(() => {
        if (!Authenticated) {
            navigate("/user/login");
        } else if (role != 3 && role != 2) {
            navigate("/user/not");
        } else {
            LoadHotel();
        }
    }, [Authenticated]);

    function LoadHotel() {
        const url = baseUrl + "/hotel/list"; 
        axios.get(url, { headers: authHeader() })
            .then(res => {
                if (res.data.success) {
                    const data = res.data.data;
                    setDataHotel(data);
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
                    <th>{data.id}</th>
                    <td>{data.name}</td>
                    <td>{data.city.name}</td>
                    <td>
                        <Link className="btn btn-outline-info" to={"/hotel/edit/" + data.id}> Edit</Link>
                    </td>
                    <td>
                        <button className="btn btn-outline-danger" onClick={() => OnDelete(data.id)}>Delete</button>
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
                Swal.fire(
                    'Cancelled',
                    'Your hotel is safe :)',
                    'error'
                )
            }
        })
    }

    function SendDelete(id) {
        const url = baseUrl + "/hotel/delete/" + id;

        axios.delete(url, { headers: authHeader() })
            .then((response) => {
                if (response.data.success) {
                    Swal.fire(
                        'Deleted',
                        'Hotel has been deleted.',
                        'success'
                    )
                    LoadHotel();
                }
            })
            .catch(error => {
                alert("Error 325");
            });
    }

    return (
        <div>
            <div className="mb-3">
            <Link className="btn btn-primary" onClick={() => navigate(-1)}>{'<'}</Link>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="text-white">Hotels List</h1>
                <Link className="btn btn-primary" to="/hotel/create">Add Hotel</Link>
            </div>
            <table className="table table-hover table-striped table-rounded">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">City</th>
                        <th colSpan="2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {dataHotel.length > 0 ? (
                        LoadFillData()
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">No Hotel Found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default HotelList;
