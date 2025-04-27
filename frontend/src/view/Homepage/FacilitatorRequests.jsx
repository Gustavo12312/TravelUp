import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import 'sweetalert2/src/sweetalert2.scss';
import React, { useEffect, useState } from "react";
import { data, Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import axios from "axios";
import authHeader from "../Auth/auth.header";
import { isAuthenticated, getUserRole, getUserid } from "../Auth/auth.utils";

const baseUrl = "http://localhost:3000";

const RequestFacilitator = ({status, refreshTrigger, onRefresh }) => {
    const [dataRequest, setDataRequest] = useState([]);
    const navigate = useNavigate();
    const Authenticated = isAuthenticated();
    let url;


    useEffect(() => {
        if (!Authenticated) {
            navigate("/user/login");
        } else {
            LoadRequest();
        }
    }, [Authenticated, status]);

    useEffect(() => {
        LoadRequest();
    }, [refreshTrigger, status]); 

    

    function LoadRequest() {
        if (status===0){
            url = baseUrl + "/request/get/status/4";
        }else {
            url = baseUrl + "/request/get/status/7";
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
                    <td>
                        <Link className="" to={"/request/edit/"+data.id}> {data.code} </Link>
                    </td>
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
                    {status=== 0 ? (
                         <td>
                            <Link className="btn btn-outline-info" onClick={() => {
                             SendUpdate(data.id, 7)}}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope-arrow-up-fill" viewBox="0 0 16 16">
                                    <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zm.192 8.159 6.57-4.027L8 9.586l1.239-.757.367.225A4.49 4.49 0 0 0 8 12.5c0 .526.09 1.03.256 1.5H2a2 2 0 0 1-1.808-1.144M16 4.697v4.974A4.5 4.5 0 0 0 12.5 8a4.5 4.5 0 0 0-1.965.45l-.338-.207z"/>
                                     <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.354-5.354 1.25 1.25a.5.5 0 0 1-.708.708L13 12.207V14a.5.5 0 0 1-1 0v-1.717l-.28.305a.5.5 0 0 1-.737-.676l1.149-1.25a.5.5 0 0 1 .722-.016"/>
                                </svg>     
                            </Link>
                     </td>
                    ):(
                       null 
                    )}
                   
                </tr>
            )
        })
    }

    const SendUpdate = (requestId, requestStatusId) => {
        const url = baseUrl + '/request/update/'+ requestId;
        
        const datapost = {
            requestStatusId: requestStatusId
        }

        axios
            .put(url, datapost, {headers: authHeader()})
            .then((response) => {
                if (response.data.success === true) {
                    alert(response.data.message);
                    onRefresh();
                } else {
                    alert(response.data.message || "Error updating request");
                }
              
            })
            .catch((error) => {
                alert("Error: " + error);
            });
            
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                {status === 0 ? (
                    <h1>New Requests</h1>
                ): (
                    <h1>Pending Requests</h1>
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
                            <td colSpan="7" className="text-center">No Request Found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default RequestFacilitator;
