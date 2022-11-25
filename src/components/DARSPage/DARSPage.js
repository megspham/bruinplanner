/**
 * @file Defines the page that new users are taken to upon login. It has a welcome
 * message for the user, and options (via buttons) to start with a blank template 
 * or import DARs.
 * @author Andy Goh
 */

import React from "react";
import "./DARSPage.css";
import BackgroundSvg from "../images/DARSPageBackground.svg";
import { CustomizedButton } from "../CustomizedButton";
import Login from "../Login";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const DARSPage = () => {
  const location = useLocation();

  async function handleChange() {
    location.state.startYear = parseInt(document.getElementById('year').value,10);
    console.log(location.state.startYear);
  }

  return (
    <div className="dars-page-container">
      <img src={BackgroundSvg} alt="Your SVG" class="dars-bg" />
      {location.state ?
        <div class="page-content">
        <h1 class="welcome-message">
            Welcome, {location.state.name}!
        </h1>
        <div class="dars-button-container">
          <form className="formInput" onChange={handleChange}>
          <label>What is your starting year?
            <input name="year" className="yearInput" type="number" min="1919" max ="2022" step="1" id="year"/>
          </label>
          </form>
          <Link to="/calendar" state={{ data: null, id: location.state.googleId }} >
            <CustomizedButton class="button disabled" id="button" text="Start with a blank template"></CustomizedButton>
          </Link>
          <Link to="/dars/upload" state={{ startYear: null, id: location.state.googleId }}>
            <CustomizedButton class="button" idtext="Import DARs"></CustomizedButton>
          </Link>
        </div>
      </div>
        :
        <div className="page-content">
            <h1 class="welcome-message">
               Please sign in again
            </h1>
            <div class="dars-button-container">
              <Login></Login>
            </div>
        </div>
      }
    </div>
  );
};

export default DARSPage;