import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import 'sweetalert2/src/sweetalert2.scss';
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import axios from "axios";
import authHeader from "../../Auth/auth.header";
import { isAuthenticated, getUserRole, getUserid } from "../../Auth/auth.utils";
import JustificationAdd from "../../Justification/JustificationAdd";

const baseUrl = "http://localhost:3000";

const RequestManager = ({refreshTrigger, onRefresh }) => {
    const [dataRequest, setDataRequest] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const navigate = useNavigate();
    const Authenticated = isAuthenticated();


    useEffect(() => {
        if (!Authenticated) {
            navigate("/user/login");
        } else {
            LoadRequest();
        }
    }, [Authenticated]);

    useEffect(() => {
        LoadRequest();
    }, [refreshTrigger]); 


    function LoadRequest() {
     
        const url = baseUrl + "/request/get/status/cost/6";
         
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
                    <td>{data.Cost}</td> 
                    <td>{data.project.budget - data.project.totalCost}</td> 
                    <td>
                        <Link className="btn btn-outline-danger" onClick={() => {setShowAdd(true), setSelectedRow(data.id)}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                            </svg>    
                        </Link>
                        <JustificationAdd requestId={selectedRow} show={showAdd} handleClose={() => setShowAdd(false)} onRefresh={onRefresh} />
                    </td>
                    <td>
                        <Link className="btn btn-outline-success" onClick={() => {
                            SendUpdateRequest(data.id, 5), SendUpdateProject(data.project.id, data.Cost, data.project.totalCost)}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                                <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
                            </svg>   
                        </Link>
                    </td>
                   
                        
                   
                </tr>
            )
        })
    }

    const SendUpdateRequest = (requestId, requestStatusId) => {
        const requesturl = baseUrl + '/request/update/' + requestId;
        
        const data = {
            requestStatusId: requestStatusId
        }
        
        axios.put(requesturl, data, {headers: authHeader()})
        .then((res) => {
            if (res.data.success === true) {
                alert(res.data.message);
                onRefresh();
            } else {
                alert(reqres.data.message || "Error updating request");
            }
        })
        .catch((error) => {
            alert("Error: " + error);
        });     
    };

    const SendUpdateProject = (projectId, cost, currentTotalCost) => {
        const projecturl = baseUrl + '/project/update/' + projectId;

        const data = {
            totalCost: currentTotalCost + cost
        }
        
         axios.put(projecturl, data, {headers: authHeader()})
        .then((res) => {
            if (res.data.success === true) {
                alert(res.data.message);
                onRefresh();
            } else  {
                alert(prores.data.message || "Error updating project");
            }
        })
        .catch((error) => {
            alert("Error: " + error);
        });     
    };
    
    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">                
                <h1>Pending Requests</h1>                                                
            </div>
            <table className="table table-hover table-striped">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">Code</th>
                        <th scope="col">Requested By</th>
                        <th scope="col">Project</th>
                        <th scope="col">Travel Date</th>
                        <th scope="col">Return Date</th>
                        <th scope="col">Cost(€)</th> 
                        <th scope="col">Available Budget(€)</th>    
                        <th scope="col">Reject</th> 
                        <th scope="col">Approve</th>               
                    </tr>
                </thead>
                <tbody>
                    {dataRequest.length > 0 ? (
                        LoadFillData()
                    ) : (
                        <tr>
                            <td colSpan="9" className="text-center">No Request Found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default RequestManager;
