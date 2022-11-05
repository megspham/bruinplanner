/**
 * @file Defines the landing page, which is fitted with a "Sign in with Google"
 * button.
 * @author Belle Lerdworatawee
 */
import React from "react";
import "./LandingPage.css";
import BackgroundSvg from "../images/LandingPageBackground.svg";
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