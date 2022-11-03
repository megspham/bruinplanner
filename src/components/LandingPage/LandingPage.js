import React from "react";
import "./LandingPage.css";
import BackgroundSvg from "../images/LandingPageBackground.svg";
import { CustomizedButton } from "../CustomizedButton";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="overflow-container">
      <img src={BackgroundSvg} alt="Your SVG" class="center"/>
      <Link to="/dars">
      <div class="button-container">
        <CustomizedButton class="button" text="ENTER HERE"></CustomizedButton>
      </div>
      </Link>
    </div>
  );
};

export default LandingPage;