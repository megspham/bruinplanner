/**
 * @file File for the SidebarButton component, which is the button used for the sidebar
 * @author Ian Galvez, Megan Pham
 */

import React from "react";
import "./SidebarButton.css";
import { DropdownButton } from "./DropdownButton";
import ReactTooltip from "react-tooltip";
import ReactDOMServer from "react-dom/server";
import { Text } from "react-native";

/**
 * Create a CustomizedButton
 * @param {string} text What to write on the button
 * @param {function} onClick Defines what function to call when the button is clicked
 * @returns CustomizedButton HTML div object
 */
export function SidebarButton({ width, height, text, kind, classInfo }) {
  if (classInfo == undefined) {
    classInfo = "";
  }

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

  let tooltipStyle = {
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: "15px",
    textAlign: "left"
  }

  if (kind === "dropdown") {
    return (
      <DropdownButton
        text={text}
      />
    );
  } else {
    return (
      <div className="myButton">
        <a
          data-for={text}
          data-html={true}
          data-tip-disable={classInfo === "" ? true : false}
          data-tip={ReactDOMServer.renderToString(
            <div style={tooltipStyle}>
              <p><b>Title: </b> {classInfo.split("|")[3]}</p>
              <p><b>Units: </b> {classInfo.split("|")[0]}</p>
              <p><b>Prerequisites: </b> {classInfo.split("|")[1] === "" ? "None" : classInfo.split("|")[1]}</p>
              <p><b>Historical Offerings: </b> {classInfo.split("|")[2]}</p>
            </div>)}>
          <button
            type="button"
            style={kind === "calendar" ? calendar_style : sidebar_style}>
            {text}
          </button>
        </a>
        <ReactTooltip
          id={text}
          place="left"
          type="light"
          effect="solid"
          multiline={true}
          textColor="#005587"
          backgroundColor="#E5F1FF"
          border={true}
          borderColor="#0070E8"
        />
      </div>
    );
  }
}
