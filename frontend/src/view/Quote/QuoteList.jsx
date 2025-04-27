import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import 'sweetalert2/src/sweetalert2.scss';
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import axios from "axios";
import authHeader from "../Auth/auth.header";
import { isAuthenticated } from "../Auth/auth.utils";
import FlightList from "../QuoteFlight/FlightList";
import QuoteHotelList from "../QuoteHotel/QuoteHotelList";
import { useCallback } from "react";

const baseUrl = "http://localhost:3000";

const QuoteList = ({refreshTrigger, select, selected, disable, refreshstatus, oriId, destId}) => {
    const [dataQuote, setDataQuote] = useState([]);
    const [totalFlightCost, setTotalFlightCost] = useState({});
    const [totalHotelCost, setTotalHotelCost] = useState(0);
    const navigate = useNavigate();
    const Authenticated = isAuthenticated();
    const { requestId } = useParams(); 

    useEffect(() => {
        if (!Authenticated) {
            navigate("/user/login");
        } else {
            LoadQuote();
        }
    }, [Authenticated]);

    useEffect(() => {
        LoadQuote();
    }, [refreshTrigger]); 

    const handleFlightTotalChange = (quoteId, total) => {
        setTotalFlightCost(prev => {
            if (prev[quoteId] === total) return prev; // Avoid unnecessary set
            return { ...prev, [quoteId]: total };
        });
    };
  
      
    
    const handleHotelTotalChange = (quoteId, total) => {
        setTotalHotelCost(prev => {
            if (prev[quoteId] === total) return prev; // Avoid unnecessary set
            return { ...prev, [quoteId]: total };
        });
    };
    

   function LoadQuote() {
        if(selected){
            const url = baseUrl + "/quote/get/selected/" + requestId;
            axios.get(url, { headers: authHeader() })
            .then(res => {
                if (res.data.success) {                   
                    setDataQuote([res.data.data]);
                } else {
                    alert("Error Web Service");
                }
            })
            .catch(error => {
                alert(error);
            }); 
        } else{
            const url = baseUrl + "/quote/getby/" + requestId;
            axios.get(url, { headers: authHeader() })
            .then(res => {
                if (res.data.success) {
                    setDataQuote(res.data.data);
                } else {
                    alert("Error Web Service");
                }
            })
            .catch(error => {
                alert(error);
            });  
        } 
    }

    function OnDelete(id) {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this quote!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.value) {
                SendDelete(id);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelled', 'Your quote is safe :)', 'error');
            }
        });
    }

    function SendDelete(id) {
        const url = baseUrl + "/quote/delete/" + id;

        axios.delete(url, { headers: authHeader() })
            .then((response) => {
                if (response.data.success) {
                    Swal.fire('Deleted', 'Quote has been deleted.', 'success');
                    LoadQuote();
                }
            })
            .catch(error => {
                alert("Error deleting quote");
            });
    }

    const SendUpdate = (quoteId) => {
       
        const url = baseUrl + "/quote/update/" + quoteId;

        const datapost = {
            isSelected: true
        }

        axios
            .put(url, datapost, {headers: authHeader()})
            .then((response) => {
                if (response.data.success === true) {
                    alert(response.data.message);
                    refreshstatus();
                } else {
                    alert(response.data.message || "Error updating quote");
                }
            })
            .catch((error) => {
                alert("Error: " + error);
            });
    }


    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                {selected ?(
                    <h2 className="text-white">Selected Quote</h2>
                ):(
                    <h2 className="text-white">Quotes List</h2>
                )}
               
            </div>

            <div className="accordion" id="quoteAccordion">                
                {(dataQuote.length > 0 && dataQuote != "") ? (
                    dataQuote.map((data, index) => (
                        <div key={index} className="accordion-item">
                            <h2 className="accordion-header">
                                <button 
                                    className="accordion-button collapsed" 
                                    type="button" 
                                    data-bs-toggle="collapse" 
                                    data-bs-target={`#collapse${data.id}`}
                                    aria-expanded="false" 
                                    aria-controls={`collapse${data.id}`}
                                >
                                 <div className="d-flex justify-content-between align-items-center w-100">
                                    <div>
                                        <strong>Agency:</strong> {data.agency.name}
                                    </div>

                                    <div className="text-end">
                                        {select && (
                                            <Link className="btn btn-primary me-4 " onClick={() => SendUpdate(data.id)}>Select</Link>
                                        )}
                                         <strong>Total Quote Cost:</strong> {(totalFlightCost[data.id] || 0) + (totalHotelCost[data.id] || 0)} €
                                        {!disable && (
                                        <Link className="btn btn-outline-danger ms-3 me-3" onClick={() => OnDelete(data.id)}> 
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                            </svg>
                                        </Link>
                                        )}
                                    </div>

                                    

                                    
                                </div>                                           
                                </button>
                            </h2>
                            <div 
                                id={`collapse${data.id}`} 
                                className="accordion-collapse collapse" 
                                data-bs-parent="#quoteAccordion"
                            >
                                <div className="accordion-body">  
                                      
                                    <FlightList quoteId={data.id} disable={disable}  onTotalChange={(total) => handleFlightTotalChange(data.id, total)} oriId={oriId} destId={destId} />
                                    <QuoteHotelList quoteId={data.id} disable={disable} onTotalChange={(total) => handleHotelTotalChange(data.id, total)} oriId={oriId} destId={destId} />                                      
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center">No Quotes Found</p>
                )}
            </div>
        </div>
    );
}

export default QuoteList;
