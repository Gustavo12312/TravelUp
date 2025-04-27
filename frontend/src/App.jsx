import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { BrowserRouter as Router, Route, Link, Routes, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import AuthService from "./view/Auth/auth.service";
import authHeader from "./view/Auth/auth.header";
import {isAuthenticated, getUserid, getUserRole} from "./view/Auth/auth.utils";
import axios from "axios";
import "./App.css";

import Login from "./view/Login";
import Register from "./view/Register";
import NotAuthorized from "./view/NotAuthorized";
import Homepage from "./view/Homepage/Homepage";


import AgencyList from "./view/Agency/AgencyList";
import AgencyAdd from "./view/Agency/AgencyAdd"; 
import AgencyEdit from "./view/Agency/AgencyEdit";

import CityList from "./view/City/CityList"
import CityAdd from "./view/City/CityAdd"
import CityEdit from "./view/City/CityEdit"

import AirportList from "./view/Airport/AirportList"
import AirportAdd from "./view/Airport/AirportAdd"
import AirportEdit from "./view/Airport/AirportEdit"

import HotelAdd from "./view/Hotel/HotelAdd";
import HotelEdit from "./view/Hotel/HotelEdit";
import HotelList from "./view/Hotel/HotelList";

import ProjectEdit from "./view/Project/ProjectEdit";
import ProjectList from "./view/Project/ProjectList";
import ProjectAdd from "./view/Project/ProjectAdd";

import RequestAdd from "./view/Request/RequestAdd";
import RequestEdit from "./view/Request/RequestEdit";
import RequestList from "./view/Request/RequestList";

import DetailEdit from "./view/PersonalDetail/DetailEdit";


const baseUrl = "http://localhost:3000";

function App() {
  const [name, setName] = useState("");
  const Authenticated = isAuthenticated();
  const role = getUserRole();
  const userId = getUserid();


  useEffect(() => {  
    if (Authenticated) {  
        const url = baseUrl + "/user/get/" + userId;

        axios.get(url, { headers: authHeader() })
            .then((res) => {
                if (res.data.success) {
                    console.log(res);
                    setName(res.data.data.name);
                } else {
                    alert("Error fetching data");
                }
            })
            .catch((error) => {
                alert("Error server: " + error);
            });
    }
}, [Authenticated]);
 

  const logOut = () => { 
    AuthService.logout();
  };

  return (
    <Router>
      <div className="App app-background">
        {Authenticated ?(
          <nav className="navbar navbar-expand-lg navbar-dark border-bottom shadow-lg">
            <Link className="navbar-brand link-primary ms-5" to="/homepage">
              <img src="/images/airplane.png" alt="Agencies" style={{ width: '45px', height: '45px' }} /></Link>
            
            {(role === 3 || role===2) && (
              <div>
               <Link className="navbar-brand text-white link-primary ms-3" to="/agency/list">Agencies</Link>
               <Link className="navbar-brand text-white link-primary ms-3" to="/airport/list">Airports</Link>
               <Link className="navbar-brand text-white link-primary ms-3" to="/city/list">Cities</Link>
               <Link className="navbar-brand text-white link-primary ms-3" to="/hotel/list">Hotels</Link>
               
               </div>
            )}

            {role === 3 && <Link className="navbar-brand text-white link-primary ms-3" to="/project/list">Projects</Link>}

            
            <Link className="navbar-brand text-white link-primary ms-3" to="/request/list">Requests</Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent"> 
              {Authenticated ? (
                <div className="d-flex justify-content-center align-items-center">
                    <Link className="navbar-brand text-white link-primary me-3" to={'/detail/edit/'+ userId} >{name}</Link>           
                    <button className="btn btn-danger me-5" onClick={logOut}>Logout</button>             
                  </div>
              ) : (
                null

              )}
              </div> 
            </nav>
            ) : (
              null
            )}

            <div className="container py-4">
              <div className="row">
                <Routes>
                  <Route path="/user/login" element={<Login />} />
                  <Route path="/user/register" element={<Register />} />
                  <Route path="/user/not" element={<NotAuthorized />} />
                  <Route path="/homepage" element={<Homepage />} />


                  <Route path="/agency/list" element={<AgencyList />} /> 
                  <Route path="/agency/create" element={<AgencyAdd />} />
                  <Route path="/agency/edit/:agencyId" element={<AgencyEdit />} />

                  <Route path="/city/list" element={<CityList />} /> 
                  <Route path="/city/create" element={<CityAdd />} />
                  <Route path="/city/edit/:cityId" element={<CityEdit />} /> 

                  <Route path="/airport/list" element={<AirportList />} /> 
                  <Route path="/airport/create" element={<AirportAdd />} />
                  <Route path="/airport/edit/:airportId" element={<AirportEdit />} />

                  <Route path="/hotel/list" element= {<HotelList/>} />
                  <Route path="/hotel/create" element= {<HotelAdd/>} />
                  <Route path="/hotel/edit/:hotelId" element= {<HotelEdit/>} />

                  <Route path="/project/list" element= {<ProjectList/>} />
                  <Route path="/project/create" element= {<ProjectAdd/>} />
                  <Route path="/project/edit/:projectId" element= {<ProjectEdit/>} />

                  <Route path="/request/list" element= {<RequestList/>} />
                  <Route path="/request/create" element= {<RequestAdd/>} />
                  <Route path="/request/edit/:requestId" element= {<RequestEdit/>} />

                  <Route path="/detail/edit/:userId" element= {<DetailEdit/>} />
                                
                </Routes>
              </div>
           </div>
         
      </div>    
      </Router>
  );
};

export default App;