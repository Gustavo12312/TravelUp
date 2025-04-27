import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import 'sweetalert2/src/sweetalert2.scss';
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import axios from "axios";
import authHeader from "../Auth/auth.header";
import { isAuthenticated, getUserRole, getUserid } from "../Auth/auth.utils";

const baseUrl = "http://localhost:3000";

const RequestTraveller = ({status}) => {
    const [dataRequest, setDataRequest] = useState([]);
    const navigate = useNavigate();
    const Authenticated = isAuthenticated();
    const userid =getUserid();
    let url;


    useEffect(() => {
        if (!Authenticated) {
            navigate("/user/login");
        } else {
            LoadRequest();
        }
    }, [Authenticated, status]);

    function LoadRequest() {
        if (status===0){
            url = baseUrl + "/request/list/open/"+userid;
        }else {
            url = baseUrl + "/request/list/approved/"+userid;
        }
         
        axios.get(url, { headers: authHeader() })
            .then(res => {
                if (res.data.success) {
                    const data = res.data.data;
                    setDataRequest(data);
                } else {
                    alert("Error Web Service");
                }
            })
            .catch(error => {
                alert(error);
            });
    }

    function LoadFillData() {
        return dataRequest.map((data, index) => {
            return (
                <tr key={index}>
                    <td><Link className="" to={"/request/edit/"+data.id}> {data.code} </Link></td>
                    <th>{data.user.name}</th>
                    <th>{data.project.name}</th>
                    <th>{format(new Date(data.travelDate),"dd/MM/yyyy")} </th>
                    <th>
                        {data.returnDate ? (
                            format(new Date(data.returnDate),"dd/MM/yyyy")
                        ):(
                            null
                        )}  
                    </th>
                    <td>{data.requeststatus.label}</td>
                </tr>
            )
        })
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                {status === 0 ? (
                    <h1>Open Requests</h1>
                ): (
                    <h1>Next Trips</h1>
                )}
            </div>
            <table className="table table-hover table-striped">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">Code</th>
                        <th scope="col">Requested By</th>
                        <th scope="col">Project</th>
                        <th scope="col">Travel Date</th>
                        <th scope="col">Return Date</th>
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {dataRequest.length > 0 ? (
                        LoadFillData()
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">No Request Found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default RequestTraveller;
