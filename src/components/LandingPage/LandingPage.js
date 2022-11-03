import React from "react";
import { View, StyleSheet } from "react-native";
import "./LandingPage.css";
import BackgroundSvg from "/home/belle/bruinplanner/src/components/images/LandingPageBackground.svg";

const LandingPage = () => {
  return (
    <div className="App">
      <img src={BackgroundSvg} alt="Your SVG" class="center"/>
    </div>
  );
};

export default LandingPage;