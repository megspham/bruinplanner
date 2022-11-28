/**
 * @file File for the SidebarButton component, which is the button used for the sidebar
 * @author Ian Galvez, Megan Pham
 */

import React, {useState} from "react";
import "./SidebarButton.css";
import { DropdownButton } from "./DropdownButton";
import ReactTooltip from "react-tooltip";
import ReactDOMServer from "react-dom/server";
// import { Text } from "react-native";

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

  const json_to_options = (json) => {
    let classes = json.classes;
    let options = []
    for (const c of classes) {
      var dict = { value: c[1], label: c[1] };
      options.push(dict);
    }
    return options
  }
  let loaded_classes = {
    'GE-AH-LC': json_to_options(require("./SidebarGroups/class-info/GE-AH-LC.json")),
    'GE-AH-VP': json_to_options(require("./SidebarGroups/class-info/GE-AH-VP.json")),
    'GE-AH-PL': json_to_options(require("./SidebarGroups/class-info/GE-AH-PL.json")),
    'GE-SC-HA': json_to_options(require("./SidebarGroups/class-info/GE-SC-HA.json")),
    'GE-SC-SA': json_to_options(require("./SidebarGroups/class-info/GE-SC-SA.json")),
    'GE-SI-LS': json_to_options(require("./SidebarGroups/class-info/GE-SI-LS.json")),
    'req-cs'  : json_to_options(require("./SidebarGroups/class-info/req-cs.json"))
  }

  let name_to_key = {
    "CS Elective 1"               : 'req-cs',
    "CS Elective 2"               : 'req-cs',
    "CS Elective 3"               : 'req-cs',
    "S&C #1: Historical Analysis" : 'GE-SC-HA',
    "S&C #1: Social Analysis"     : 'GE-SC-SA',
    "SI #1: Life Sciences"        : 'GE-SI-LS'
  }

  const [elective1, setelective1] = useState(null);
  const [elective2, setelective2] = useState(null);
  const [elective3, setelective3] = useState(null);
  const [elective4, setelective4] = useState(null);
  const [elective5, setelective5] = useState(null);

  if (kind === "dropdown") {
    return (
      <DropdownButton
        text={text}
        options={loaded_classes[name_to_key[text]]}
        setSelectedOption={setelective1}
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
