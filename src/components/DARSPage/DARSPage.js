/**
 * @file Defines the page that new users are taken to upon login. It has a welcome
 * message for the user, and options (via buttons) to start with a blank template 
 * or import DARs.
 * @author Andy Goh, Megan Pham
 */

import React, { useState } from "react";
import "./DARSPage.css";
import BackgroundSvg from "../images/DARSPageBackground.svg";
import { CustomizedButton } from "../CustomizedButton";
import Login from "../Login";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";


const DARSPage = () => {
  const location = useLocation();
  const [startYear, setStartYear] = useState(new Date().getFullYear());

  function handleChange(event) {
    setStartYear(parseInt(event.target.value,10));
    console.log(startYear);
  }


  return (
    <div className="dars-page-container">
      <img src={BackgroundSvg} alt="Your SVG" class="dars-bg" />
      {location.state ?
        <div class="page-content">
        <h1 class="welcome-message">
            Welcome, {location.state.name}!
        </h1>
        <div className="new-template-container">
          <label className="yearLabel">What is your starting year?
            <input name="year" type="number" min="1919" max ="2022" step="1" id="year" onChange={handleChange}/>
          </label>
          </div>
        <div class="dars-button-container">
          <Link to="/calendar" state={{ startYear: startYear, data: null, id: location.state.googleId }} >
            <CustomizedButton text="Start with a blank template"></CustomizedButton>
          </Link>
          <Link to="/dars/upload" state={{ startYear: null, id: location.state.googleId }}>
            <CustomizedButton text="Import DARs"></CustomizedButton>
          </Link>
        </div>
      </div>
        :
        <div className="page-content">
            <h1 class="welcome-message">
               Please sign in again
            </h1>
            <div class="dars-button-container">
              <Login destination={"/dars"}></Login>
            </div>
        </div>
      }
    </div>
  );
};

export default DARSPage;