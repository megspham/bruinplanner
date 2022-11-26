/**
 * @file File for the SidebarButton component, which is the button used for the sidebar
 * @author Ian Galvez, Megan Pham
 */

import React from "react";
import "./SidebarButton.css";

/**
 * Create a CustomizedButton
 * @param {string} text What to write on the button
 * @param {function} onClick Defines what function to call when the button is clicked
 * @returns CustomizedButton HTML div object
 */
export function SidebarButton({ width, height, text, kind }) {
  let sidebar_style = {
    width: "333.78px",
    height: "73.86px",
    background: "#FFFFFF",
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: "25.7902px",
    lineHeight: "31px",
    border: "none",
    borderRadius: "3.68431px",
    textTransform: "uppercase",
    color: "#005587",
    boxShadow: "0px 0px 11.0283px #8BB8E8",
    margin: "10px",
  };
  let calendar_style = {
    width: "200px",
    height: "28px",
    background: "#FFFFFF",
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: "20.7902px",
    lineHeight: "28px",
    border: "none",
    borderRadius: "3.68431px",
    textTransform: "uppercase",
    color: "#005587",
    boxShadow: "0px 0px 11.0283px #8BB8E8",
    margin: "2px",
  };
  return (
    <button
      type="button"
      style={kind === "calendar" ? calendar_style : sidebar_style}
    >
      {text}
    </button>
  );
}
