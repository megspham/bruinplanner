import React from "react";
import "./LandingPage.css";
import BackgroundSvg from "../images/LandingPageBackground.svg";
import { CustomizedButton } from "../CustomizedButton";
import { Link } from "react-router-dom";
import Login from "../Login";

const LandingPage = () => {
  return (
    <div className="overflow-container">
      <img src={BackgroundSvg} alt="Your SVG" class="center"/>
      {/* <Link to="/dars"> */}
      <div className="button-container">
        <Login />
      </div>
      {/* </Link> */}
    </div>
  );
};

export default LandingPage;