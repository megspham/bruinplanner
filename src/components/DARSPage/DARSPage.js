import React from "react";
// import { View, StyleSheet } from "react-native";
import "./DARSPage.css";
import BackgroundSvg from "../images/DARSPageBackground.svg";
import { CustomizedButton } from "../CustomizedButton";

const DARSPage = () => {
  return (
    <div className="App">
        <img src={BackgroundSvg} alt="Your SVG" class="center"/>
        <div class="button-container">
            <CustomizedButton class="button" text="Start with a blank template"></CustomizedButton>
            <CustomizedButton class="button" text="Import DARS"></CustomizedButton>
        </div>
    </div>
  );
};

export default DARSPage;