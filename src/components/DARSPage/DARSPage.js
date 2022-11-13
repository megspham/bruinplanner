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
import { Link } from "react-router-dom";
import Logout from "../Logout";
import { useLocation } from "react-router-dom";

const DARSPage = () => {
  const location = useLocation();
  return (
    <div className="dars-page-container">
      <img src={BackgroundSvg} alt="Your SVG" class="dars-bg" />
      <div class="page-content">
        <h1 class="welcome-message">
          Welcome, {location.state.name}!
        </h1>
        <div class="dars-button-container">
          <Link to="/calendar">
            <CustomizedButton class="button" text="Start with a blank template"></CustomizedButton>
          </Link>
          <CustomizedButton class="button" text="Import DARS"></CustomizedButton>
        </div>
      </div>
    </div>
  );
};

export default DARSPage;