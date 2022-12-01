/**
 * @file Instructions for uploading a DARS file for import.
 * Communicates with the backend to parse the uploaded DARS file, and
 * sends the result to the Calendar for display.
 * @author Andy Goh
 */

import React from "react";
import BackgroundSvg from "../images/DARSPageBackground.svg";
import { useLocation } from "react-router-dom";
import UploadFileForm from "./UploadFileForm";
import Login from "../Login";
import { Link } from "react-router-dom";

import "./DARSUpload.css";

const DARSUpload = () => {
  const location = useLocation();
  const id = location.state ? location.state.user.googleId : null;
  const error = location.state ? location.state.error : false;
  return (
    <div>
      {id ? (
        <div className="dars-upload-container">
          <img src={BackgroundSvg} alt="Your SVG" className="dars-bg" />
          <div className="instructions">
          {error ? <p>Invalid DARS file. Please check the file that you uploaded, or try <Link to="/dars" state={ location.state.user }>starting with a blank template</Link></p> : null}
          </div>
          <div className="instructions">
            <ol>
              <li>Generate a DARS audit from MyUCLA</li>
              <li>Click on "View Audit"</li>
              <li>
                Right click and press "Save As..." and choose the option
                "Webpage, HTML only"
              </li>
            </ol>
          </div>
          <div class="page-content">
            <div class="dars-button-container2">
              <UploadFileForm googleId={location.state.user}></UploadFileForm>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1 class="welcome-message">Please sign in again</h1>
          <div class="dars-button-container2">
            <Login destination={"/dars/upload"}></Login>
          </div>
        </div>
      )}
    </div>
  );
};

export default DARSUpload;
