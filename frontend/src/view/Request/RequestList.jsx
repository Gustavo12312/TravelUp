import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import 'sweetalert2/src/sweetalert2.scss';
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { format } from "date-fns";
import axios from "axios";
import authHeader from "../Auth/auth.header";
import { isAuthenticated, getUserid, getUserRole } from "../Auth/auth.utils";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import "../View.css"

const baseUrl = "http://localhost:3000";

const RequestList = () => {
    const [dataRequest, setDataRequest] = useState([]);
    const navigate = useNavigate();
    const Authenticated = isAuthenticated();
    const Role =getUserRole();
    const userid =getUserid();
    let url;


    useEffect(() => {
        if (!Authenticated) {
            navigate("/user/login");
        } else {
            LoadRequest();
        }
    }, [Authenticated]);

    function LoadRequest() {
        if (Role===3){
            url = baseUrl + "/request/list";
        }else {
            url = baseUrl + "/request/get/user/" + userid;
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
                    <td>{data.code}</td>
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
                    <td>
                        <Link className="btn btn-outline-info" to={"/request/edit/" + data.id}> Edit</Link>
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
            text: 'You will not be able to recover this request!',
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
                    'Your request is safe :)',
                    'error'
                )
            }
        })
    }

    function SendDelete(id) {
        const url = baseUrl + "/request/delete/" + id;

        axios.delete(url, { headers: authHeader() })
            .then((response) => {
                if (response.data.success) {
                    Swal.fire(
                        'Deleted',
                        'Request has been deleted.',
                        'success'
                    )
                    LoadRequest();
                }
            })
            .catch(error => {
                alert("Error 325");
            });
    }

    function downloadApprovedRequests() {
        const approved = dataRequest.filter(req => req.requeststatus.label === "Approved");
    
        if (approved.length === 0) {
            Swal.fire("No approved requests", "", "info");
            return;
        }
    
        const exportData = approved.map((req) => ({
            Code: req.code,
            User: req.user.name,
            Project: req.project.name,
            TravelDate: format(new Date(req.travelDate), "dd/MM/yyyy"),
            ReturnDate: req.returnDate ? format(new Date(req.returnDate), "dd/MM/yyyy") : "",
            CheckInDate: req.checkInDate ? format(new Date(req.checkInDate), "dd/MM/yyyy") : "",
            CheckOutDate: req.checkOutDate ? format(new Date(req.checkOutDate), "dd/MM/yyyy") : "",
            Status: req.requeststatus.label,
        }));
    
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Approved Requests");
    
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(fileData, "Approved_Requests.xlsx");
    }

    function exportApprovedRequestsPDF () {
        const doc = new jsPDF();
        const title = "Approved Requests";
        // Get the page width
        const pageWidth = doc.internal.pageSize.getWidth();
        // Get the text width
        const textWidth = doc.getTextWidth(title);
        // Calculate the center x-position
        const x = (pageWidth - textWidth) / 2;
        doc.text(title, x, 15);
        const approvedRequests = dataRequest.filter(
            (req) => req.requeststatus.label === "Approved"
        );
    
        const tableData = approvedRequests.map((data, index) => [
            data.code,
            data.user.name,
            data.project.name,
            format(new Date(data.travelDate), "dd/MM/yyyy"),
            data.returnDate ? format(new Date(data.returnDate), "dd/MM/yyyy") : "",
            data.checkInDate ? format(new Date(data.checkInDate), "dd/MM/yyyy") : "",
            data.checkOutDate ? format(new Date(data.checkOutDate), "dd/MM/yyyy") : "",
            data.requeststatus.label
        ]);
    
        autoTable(doc,{
            head: [["Code", "Requested By", "Project", "Travel Date", "Return Date", "CheckInDate", "CheckOutDate", "Status"]],
            body: tableData,
            startY: 25,
        });
    
        doc.save("approved_requests.pdf");
    };    

    return (
        <div>
         
            <div className="d-flex justify-content-between align-items-center mb-3">
                <Link className="btn btn-primary" onClick={() => navigate(-1)}>{'<'}</Link>
                <div>
                    <button className="btn btn-danger me-3" onClick={exportApprovedRequestsPDF}>
                    Approved PDF
                </button>
                <button className="btn btn-success" onClick={downloadApprovedRequests}>
                    Download Approved
                </button>
                </div>                
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="text-white">Requests List</h1>
                <Link className="btn btn-primary" to="/request/create">Add Request</Link>
            </div>
            <table className="table table-hover table-striped table-rounded">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">Code</th>
                        <th scope="col">Requested By</th>
                        <th scope="col">Project</th>
                        <th scope="col">Travel Date</th>
                        <th scope="col">Return Date</th>
                        <th scope="col">Status</th>
                        <th colSpan="2">Action</th>
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

export default RequestList;
