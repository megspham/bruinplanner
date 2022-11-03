import React from "react";
import "./DARSPage.css";
import BackgroundSvg from "../images/DARSPageBackground.svg";
import { CustomizedButton } from "../CustomizedButton";
import { Link } from "react-router-dom";

const DARSPage = () => {
  return (
    <div className="overflow-container">
        <img src={BackgroundSvg} alt="Your SVG" class="center"/>
        <div class="dars-button-container">
            <Link to="/calendar">
                <CustomizedButton class="button" text="Start with a blank template"></CustomizedButton>
            </Link>
            <CustomizedButton class="button" text="Import DARS"></CustomizedButton>
        </div>
    </div>
  );
};

export default DARSPage;